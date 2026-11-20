import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/components/toastStore';
import {
  getMainShortcuts,
  getServiceTutorial,
  saveMainShortcuts,
  saveServiceTutorialSeen,
} from './api';

export const dashboardKeys = {
  shortcuts: ['dashboard', 'shortcuts'],
  tutorial: ['dashboard', 'tutorial'],
};

/** 메인 반려동물 바로가기(회원 단위) */
export const useMainShortcuts = () =>
  useQuery({
    queryKey: dashboardKeys.shortcuts,
    queryFn: getMainShortcuts,
  });

/** 바로가기 저장. 응답의 목록으로 다시 그린다 */
export const useSaveMainShortcuts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveMainShortcuts,
    onSuccess: (shortcuts) =>
      queryClient.setQueryData(dashboardKeys.shortcuts, shortcuts),
    onError: (error) => showToast(error.message, { type: 'error' }),
  });
};

/** 서비스 튜토리얼 봤음(회원 단위) */
export const useServiceTutorial = () =>
  useQuery({
    queryKey: dashboardKeys.tutorial,
    queryFn: getServiceTutorial,
  });

/** 서비스 튜토리얼 봤음 저장. 실패해도 알리지 않는다(다음 접속 때 다시 열림) */
export const useSaveServiceTutorialSeen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveServiceTutorialSeen,
    onSuccess: (tutorial) =>
      queryClient.setQueryData(dashboardKeys.tutorial, tutorial),
  });
};
