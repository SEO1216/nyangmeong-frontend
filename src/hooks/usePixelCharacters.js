import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { CRT_JOB_STTS } from '@/utils/petCodes';

/**
 * [캐릭터 목록 조회] GET /pixel-characters
 * - 마이페이지 캐릭터 화면과 종합 건강기록 배너가 같이 쓴다(캐시 하나)
 * - 캐릭터 없는 반려동물 행은 pixelCharSn 없음
 */
export const pixelCharacterKeys = {
  all: ['pixel-characters'],
};

const getPixelCharacters = () => api.get('/pixel-characters');

const CHAR_POLL_MS = 4000;
const CHAR_POLL_LIMIT_MS = 12 * 60 * 1000;

/**
 * 캐릭터 목록
 * - isPolling이면 생성 중인 동물이 있는 동안 4초마다 다시 읽는다(처음 본 때부터 12분이 지나면 멈춤)
 * - select: 목록에서 필요한 값만 고를 때
 * - 화면을 옮겨도 다시 받지 않도록 5분 동안 새 값으로 본다. 생성·꾸미기·삭제 뒤에는 무효화로 다시 읽는다
 */
export const usePixelCharacters = ({ isPolling = false, select } = {}) => {
  const startedAtRef = useRef(null);
  return useQuery({
    queryKey: pixelCharacterKeys.all,
    queryFn: getPixelCharacters,
    select,
    staleTime: 5 * 60 * 1000,
    refetchInterval: isPolling
      ? ({ state }) => {
          const isCreating = state.data?.some(
            (item) =>
              item.crtJobSttsCd === CRT_JOB_STTS.REQUESTED ||
              item.crtJobSttsCd === CRT_JOB_STTS.GENERATING,
          );
          if (!isCreating) {
            startedAtRef.current = null;
            return false;
          }
          startedAtRef.current ??= Date.now();
          return Date.now() - startedAtRef.current < CHAR_POLL_LIMIT_MS
            ? CHAR_POLL_MS
            : false;
        }
      : false,
  });
};
