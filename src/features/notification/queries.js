import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { showToast } from '@/components/toastStore';
import {
  getNotificationSettings,
  getNotifications,
  getUnreadCount,
  readAllNotifications,
  readNotification,
  saveNotificationSettings,
} from './api';

export const notificationKeys = {
  unreadCount: ['notifications', 'unread-count'],
  list: ['notifications', 'list'],
  settings: ['notifications', 'settings'],
};

/** 배치(09:00) 생성 알림을 열린 창에도 반영하는 1분 주기 조회. 로그인 전에는 enabled=false */
export const useUnreadCount = (enabled = true) =>
  useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: getUnreadCount,
    enabled,
    refetchInterval: 60_000,
  });

/** 쪽 경계에서 새 알림이 끼면 같은 행이 두 쪽에 올 수 있어 inappNotiSn으로 거른다 */
const mergePages = (data) => {
  const seen = new Set();
  return data.pages
    .flatMap((page) => page.content)
    .filter((notification) => {
      if (seen.has(notification.inappNotiSn)) return false;
      seen.add(notification.inappNotiSn);
      return true;
    });
};

/**
 * tab별 알림 목록(5건씩 더 불러오기)
 * gcTime 0: 패널을 닫거나 탭을 떠나면 캐시를 버려 다시 열 때 1쪽부터
 * 탭을 바꾸면 이전 탭 목록을 남기지 않고 첫 쪽 스켈레톤부터(placeholderData 없음)
 */
export const useNotifications = (tab) =>
  useInfiniteQuery({
    queryKey: [...notificationKeys.list, tab.key],
    queryFn: ({ pageParam }) =>
      getNotifications({ tab: tab.tab, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasNext ? last.page + 1 : undefined),
    select: mergePages,
    gcTime: 0,
  });

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: readNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount });
      queryClient.invalidateQueries({ queryKey: notificationKeys.list });
    },
  });
};

export const useReadAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: readAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount });
      /** 불러온 쪽을 모두 다시 받지 않고 1쪽부터 */
      queryClient.resetQueries({ queryKey: notificationKeys.list });
      showToast('모두 읽었어요', { type: 'success' });
    },
    onError: () =>
      showToast('모두 읽음 처리하지 못했어요. 잠시 뒤 다시 시도해 주세요', {
        type: 'error',
      }),
  });
};

export const useNotificationSettings = () =>
  useQuery({
    queryKey: notificationKeys.settings,
    queryFn: getNotificationSettings,
  });

export const useSaveNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveNotificationSettings,
    onSuccess: (saved) => {
      queryClient.setQueryData(notificationKeys.settings, saved);
      showToast('저장했어요', { type: 'success' });
    },
    onError: (error) =>
      showToast(
        error.code === 'INVALID_INPUT_VALUE'
          ? '미리 알림 시점을 하나 이상 골라 주세요'
          : '저장하지 못했어요. 잠시 뒤 다시 시도해 주세요',
        { type: 'error' },
      ),
  });
};
