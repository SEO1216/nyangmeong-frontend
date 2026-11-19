import { api } from '@/api/axios';

export const getUnreadCount = () => api.get('/notifications/unread-count');

/** tab: ALL·CARE·COMMUNITY·INFO. 5건씩 쪽 조회(안 읽음 우선·최신순, 7일 경과 숨김은 서버) */
export const getNotifications = ({ tab, page }) =>
  api.get('/notifications', { params: { tab, page, size: 5 } });

export const readNotification = (inappNotiSn) =>
  api.post(`/notifications/${inappNotiSn}/read`);

/** 탭과 상관없이 숨김 기준 안의 미읽음 전부. 응답 본문은 쓰지 않음 */
export const readAllNotifications = () => api.post('/notifications/read-all');

export const getNotificationSettings = () =>
  api.get('/members/me/notification-settings');

export const saveNotificationSettings = (body) =>
  api.put('/members/me/notification-settings', body);
