import { useEffect, useRef } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createAdminInquiryAnswer,
  getAdminInquiries,
  getAdminInquiry,
  getAdminInquiryImage,
  getAdminInquiryTypes,
  processAdminInquiryCharacterError,
  regenerateAdminCharacter,
  updateAdminInquiryAnswer,
} from './api';

/** 재생성 작업이 끝나지 않은 상태(CHRG01): 요청, 생성 중 */
const REGEN_RUNNING_CODES = ['CHRC0001', 'CHRC0002'];
/** 재생성 상태를 다시 받는 간격(ms) */
const REGEN_POLL_MS = 5000;

export const adminInquiryKeys = {
  all: ['adminInquiry'],
  list: (params) => ['adminInquiry', 'list', params],
  detail: (otoInqrySn) => ['adminInquiry', 'detail', otoInqrySn],
  image: (otoInqrySn, atchFileSn) => [
    'adminInquiry',
    'image',
    otoInqrySn,
    atchFileSn,
  ],
  types: ['adminInquiry', 'types'],
};

export const useAdminInquiries = (params) =>
  useQuery({
    queryKey: adminInquiryKeys.list(params),
    queryFn: () => getAdminInquiries(params),
    placeholderData: keepPreviousData,
  });

export const useAdminInquiry = (otoInqrySn) =>
  useQuery({
    queryKey: adminInquiryKeys.detail(otoInqrySn),
    queryFn: () => getAdminInquiry(otoInqrySn),
    enabled: Number.isInteger(otoInqrySn),
    /** 무료 재생성이 진행 중이면 끝날 때까지 다시 받기 */
    refetchInterval: (query) =>
      REGEN_RUNNING_CODES.includes(query.state.data?.regenJobSttsCd)
        ? REGEN_POLL_MS
        : false,
  });

/** 공통코드는 화면을 열어 둔 동안 변경 없음 */
export const useAdminInquiryTypes = () =>
  useQuery({
    queryKey: adminInquiryKeys.types,
    queryFn: getAdminInquiryTypes,
    staleTime: Infinity,
  });

/**
 * 첨부 이미지 주소: { [atchFileSn]: object URL }
 * - 큰 원본이라 gcTime을 0으로 해 화면을 떠나면 캐시 삭제, 주소도 그때 해제
 * - 해제는 떠난 뒤 한 틱 미룬다: 상세 ↔ 수정처럼 바로 다음 화면이 같은 캐시 주소를 받아 쓰고 있으면 해제하지 않는다
 *   (그 화면이 떠날 때 해제). 바로 해제하면 다음 화면에 깨진 이미지가 보인다
 */
export const useAdminInquiryImageUrls = (otoInqrySn, imgs) => {
  const queryClient = useQueryClient();
  const urls = useQueries({
    queries: imgs.map(({ atchFileSn }) => ({
      queryKey: adminInquiryKeys.image(otoInqrySn, atchFileSn),
      queryFn: async () =>
        URL.createObjectURL(await getAdminInquiryImage(otoInqrySn, atchFileSn)),
      staleTime: Infinity,
      gcTime: 0,
      retry: false,
    })),
    /** 받는 중 undefined, 실패 null */
    combine: (results) =>
      results.map((result) => (result.isError ? null : result.data)),
  });
  const entriesRef = useRef([]);
  useEffect(() => {
    entriesRef.current = imgs.map(({ atchFileSn }, index) => [
      adminInquiryKeys.image(otoInqrySn, atchFileSn),
      urls[index],
    ]);
  });
  useEffect(
    () => () => {
      const entries = entriesRef.current;
      setTimeout(() =>
        entries.forEach(([queryKey, url]) => {
          if (!url) return;
          const query = queryClient
            .getQueryCache()
            .find({ queryKey, exact: true });
          const inUse =
            query?.getObserversCount() > 0 && query.state.data === url;
          if (!inUse) URL.revokeObjectURL(url);
        }),
      );
    },
    [queryClient],
  );
  return Object.fromEntries(
    imgs.map(({ atchFileSn }, index) => [atchFileSn, urls[index]]),
  );
};

/** 처리 결과를 상세 캐시에 바로 넣고 목록은 다시 받기 */
const useApplyInquiryResult = () => {
  const queryClient = useQueryClient();
  return (inquiry) => {
    queryClient.setQueryData(
      adminInquiryKeys.detail(inquiry.otoInqrySn),
      inquiry,
    );
    return queryClient.invalidateQueries({
      queryKey: [...adminInquiryKeys.all, 'list'],
    });
  };
};

/** 실패(이미 처리·삭제됨 등)면 상세를 다시 받아 지금 상태로 */
const useRefetchInquiry = () => {
  const queryClient = useQueryClient();
  return (error, { otoInqrySn }) =>
    queryClient.invalidateQueries({
      queryKey: adminInquiryKeys.detail(otoInqrySn),
    });
};

export const useCreateAdminInquiryAnswer = () =>
  useMutation({
    mutationFn: createAdminInquiryAnswer,
    onSuccess: useApplyInquiryResult(),
    onError: useRefetchInquiry(),
  });

export const useUpdateAdminInquiryAnswer = () =>
  useMutation({
    mutationFn: updateAdminInquiryAnswer,
    onSuccess: useApplyInquiryResult(),
    onError: useRefetchInquiry(),
  });

/**
 * 캐릭터 오류 처리: { inquiry, regenFailed }
 * - 무료 재생성(CHRC0008)이면 이어서 AI 서버에 재생성을 시작시킨다
 * - AI 서버 호출이 실패해도 처리는 기록됐으므로 성공으로 끝내고 regenFailed만 알린다
 *   (시작 못 한 작업은 서버 시간 초과 배치가 실패로 정리해 다시 처리할 수 있다)
 */
const processCharacterError = async (variables) => {
  const inquiry = await processAdminInquiryCharacterError(variables);
  if (
    variables.charErrPrcsRsltCd !== 'CHRC0008' ||
    inquiry.regenJobSn == null
  ) {
    return { inquiry, regenFailed: false };
  }
  try {
    await regenerateAdminCharacter(inquiry.regenJobSn);
    return { inquiry, regenFailed: false };
  } catch {
    return { inquiry, regenFailed: true };
  }
};

export const useProcessAdminInquiryCharacterError = () => {
  const queryClient = useQueryClient();
  const applyResult = useApplyInquiryResult();
  return useMutation({
    mutationFn: processCharacterError,
    onSuccess: ({ inquiry }) => {
      applyResult(inquiry);
      /** 재생성 상태(regenJobSttsCd)를 지금 값으로 */
      return queryClient.invalidateQueries({
        queryKey: adminInquiryKeys.detail(inquiry.otoInqrySn),
      });
    },
    onError: useRefetchInquiry(),
  });
};
