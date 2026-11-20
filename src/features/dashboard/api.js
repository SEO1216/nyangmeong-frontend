import { api } from '@/api/axios';
import { IS_DEV } from '@/api/env';

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
 * [서비스 튜토리얼 봤음 가짜 API] (SCR-MAN-001, 백엔드 API 나오기 전까지)
 * - 나오면 본문만 api 요청으로 바꾼다. 미확정: 경로, 필드 이름(tutorialSeenYn)
 * - 처음은 안 봄, 저장하면 봄(새로고침하면 처음으로)
 * - 개발 환경에서 ?fake=tutorial-seen이면 봄, ?fake=tutorial-error면 조회 실패
 */
let fakeTutorialSeenYn = false;

const readFakeParam = () =>
  IS_DEV ? new URLSearchParams(window.location.search).get('fake') : null;

/** 서비스 튜토리얼 봤음 조회: { tutorialSeenYn } */
export const getServiceTutorial = async () => {
  const fake = readFakeParam();
  if (fake === 'tutorial-error') {
    throw {
      code: 'SERVER_ERROR',
      message: '튜토리얼 정보를 불러오지 못했어요.',
      fields: null,
      data: null,
    };
  }
  return { tutorialSeenYn: fake === 'tutorial-seen' || fakeTutorialSeenYn };
};

/** 서비스 튜토리얼 봤음 저장: 조회와 같은 응답 */
export const saveServiceTutorialSeen = async () => {
  fakeTutorialSeenYn = true;
  return { tutorialSeenYn: true };
};
