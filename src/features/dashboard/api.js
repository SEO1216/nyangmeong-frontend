import { api } from '@/api/axios';

/**
 * 메인 반려동물 바로가기 조회·저장 (LJS 백엔드)
 * - 응답: 양육 중인 반려동물 전부 [{ petSn, shrtcCds }] (코드는 보일 순서대로)
 * - 저장한 적 없는 반려동물은 빈 목록
 */

/** 메인 바로가기 GET /pets/main-shortcuts */
export const getMainShortcuts = () => api.get('/pets/main-shortcuts');

/** 메인 바로가기 저장 PUT /pets/main-shortcuts. 반려동물별 목록을 보내고 조회와 같은 응답을 받는다 */
export const saveMainShortcuts = (shortcuts) =>
  api.put('/pets/main-shortcuts', shortcuts);

/**
 * 서비스 튜토리얼 봤음 조회·저장 (LJS 백엔드, SCR-MAN-001)
 * - 응답: { tutrlViewYn }. 신규 가입 회원만 false(false면 메인에서 튜토리얼 모달을 띄운다)
 * - 저장은 본문 없음. 이미 봤어도 같은 응답(멱등)
 */

/** 서비스 튜토리얼 봤음 조회 GET /members/me/tutorial */
export const getServiceTutorial = () => api.get('/members/me/tutorial');

/** 서비스 튜토리얼 봤음 저장 PUT /members/me/tutorial. 조회와 같은 응답 */
export const saveServiceTutorialSeen = () => api.put('/members/me/tutorial');
