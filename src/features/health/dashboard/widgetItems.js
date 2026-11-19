import { PATHS } from '@/routes/paths';
import { MEAL, STOOL, WALK, WATER, WEIGHT } from '../diaryTypes';
import { DIARY_EXAM_PATH, DIARY_OBS_PATH } from '../summary/summaryUtils';

/**
 * [건강 대시보드 기록 항목] (※신규 정책, 흐름도 D1~D11)
 * - 4묶음 12개(첨부 자료 추가-2 포함). AI 건강분석 리포트는 항상 표시라 고르는 대상이 아님(D9)
 * - 케어리스트(HLTC0096)는 대시보드에서 뺌: 체크는 케어 캘린더에서만 하고 메인 ★ 표시와 겹침 (※신규 정책)
 * - 화면 안에서는 id(weight…vacc)를 쓰고, 서버와 주고받을 때만 공통코드 dshbdWdgtCd(HLTC0084~0095)로 바꿈
 * - 이름·설명·빈 상태 문구·링크는 프로토타입 원문
 * - moveTo: 카드 오른쪽 위 이동 링크·760px 미만 타일이 가는 곳 (※신규 정책, 대시보드 카드 이동). 함수면 petSn을 받아 주소를 만듦(getMovePath)
 * - moveText: 이동 링크 글자(「기록하기 ›」·「검진 기록 보기 ›」 등)
 * - typeCd가 있는 매일 기록 5개의 「기록하기 ›」·760px 미만 타일은 건강 일지 「오늘 기록하기」 모달을 그 항목으로 엶 (※신규 정책)
 */

const DIARY_GRAPH_PATH = `${PATHS.HEALTH_DIARY}#hlt002-graph`;
const CALENDAR_PATH = `${PATHS.HEALTH_CALENDAR}#hlt003-calendar`;

export const WIDGET_GROUPS = [
  {
    name: '매일 기록',
    sub: '건강 일지',
    items: [
      {
        id: 'weight',
        dshbdWdgtCd: 'HLTC0084',
        nm: '체중',
        icon: 'monitor_weight',
        typeCd: WEIGHT,
        desc: '첫 기록을 남기면 그래프로 보여요',
        emptyText: '기록이 없어요',
        moveTo: DIARY_GRAPH_PATH,
        moveText: '기록하기',
      },
      {
        id: 'meal',
        dshbdWdgtCd: 'HLTC0085',
        nm: '식사량',
        icon: 'restaurant',
        typeCd: MEAL,
        desc: '하루 먹은 양을 남겨요',
        emptyText: '기록이 없어요',
        moveTo: DIARY_GRAPH_PATH,
        moveText: '기록하기',
      },
      {
        id: 'water',
        dshbdWdgtCd: 'HLTC0086',
        nm: '음수량',
        icon: 'water_drop',
        typeCd: WATER,
        desc: '하루 마신 물의 양을 남겨요',
        emptyText: '기록이 없어요',
        moveTo: DIARY_GRAPH_PATH,
        moveText: '기록하기',
      },
      {
        id: 'walk',
        dshbdWdgtCd: 'HLTC0087',
        nm: '산책',
        icon: 'directions_walk',
        typeCd: WALK,
        desc: '산책 시간을 남겨요',
        emptyText: '기록이 없어요',
        moveTo: DIARY_GRAPH_PATH,
        moveText: '기록하기',
      },
      {
        id: 'poop',
        dshbdWdgtCd: 'HLTC0088',
        nm: '배변 상태',
        icon: 'wc',
        typeCd: STOOL,
        desc: '배변 모양과 횟수를 남겨요',
        emptyText: '기록이 없어요',
        moveTo: DIARY_GRAPH_PATH,
        moveText: '기록하기',
      },
    ],
  },
  {
    name: '병원·검사',
    sub: '종합 건강기록',
    items: [
      {
        id: 'ckup',
        dshbdWdgtCd: 'HLTC0089',
        nm: '검진기록',
        icon: 'local_hospital',
        desc: '병원에 다녀오면 남겨요',
        emptyText: '병원에 다녀온 기록을 남기면 여기에 시간순으로 모여요',
        moveTo: DIARY_EXAM_PATH,
        moveText: '검진 기록 보기',
      },
      {
        id: 'insp',
        dshbdWdgtCd: 'HLTC0090',
        nm: '검사 수치',
        icon: 'science',
        desc: '검사 결과지 수치를 남겨요',
        emptyText: '검사 기록이 없어요',
        moveTo: DIARY_EXAM_PATH,
        moveText: '검진 기록 보기',
      },
      {
        id: 'presc',
        dshbdWdgtCd: 'HLTC0091',
        nm: '처방·투약',
        icon: 'medication',
        desc: '처방받은 약과 투약 일정을 남겨요',
        emptyText: '검진상세에서 처방약을 등록하면 여기에 모여요',
        /** 처방이 있으면 카드 본문이 가장 위 처방의 검진상세 처방·투약 탭으로 바꿈(WidgetCard) */
        moveTo: DIARY_EXAM_PATH,
        moveText: '처방 보기',
      },
      /** 첨부 자료 (※신규 정책, 추가-2) */
      {
        id: 'atch',
        dshbdWdgtCd: 'HLTC0092',
        nm: '첨부 자료',
        icon: 'description',
        desc: '검진기록에 올린 결과지·증명서를 모아 봐요',
        emptyText: '검진상세에 올린 결과지·증명서·영상 사진이 여기에 모여요',
        moveTo: DIARY_EXAM_PATH,
        moveText: '검진 기록 보기',
      },
    ],
  },
  {
    name: '관찰·주의',
    sub: '건강 일지 · 종합 건강기록',
    items: [
      {
        id: 'obsv',
        dshbdWdgtCd: 'HLTC0093',
        nm: '지속 관찰',
        icon: 'photo_camera',
        desc: '지켜볼 증상을 사진으로 남겨요',
        emptyText:
          '계속 지켜볼 곳을 사진으로 남기면 처음과 최근을 비교해 보여요',
        moveTo: DIARY_OBS_PATH,
        moveText: '관찰 기록 보기',
      },
      {
        id: 'allergy',
        dshbdWdgtCd: 'HLTC0094',
        nm: '알레르기·기저질환',
        icon: 'warning',
        desc: '주의할 점을 적어 둬요',
        emptyText: '등록된 내용 없음',
        /** 마이페이지 반려동물 관리에서 그 아이의 수정 모달을 엶(PetListPage가 ?edit=petSn을 읽음) */
        moveTo: (petSn) => `${PATHS.MYPAGE_PETS}?edit=${petSn}`,
        moveText: '수정하기',
      },
    ],
  },
  {
    name: '케어 일정',
    sub: '케어 캘린더',
    items: [
      {
        id: 'vacc',
        dshbdWdgtCd: 'HLTC0095',
        nm: '예방접종·정기검진',
        icon: 'vaccines',
        desc: '다음 접종일을 등록해요',
        emptyText: '등록된 예정 일정 없음',
        moveTo: CALENDAR_PATH,
        moveText: '캘린더 보기',
      },
    ],
  },
];

export const WIDGET_ITEMS = WIDGET_GROUPS.flatMap((group) => group.items);

export const findWidgetItem = (id) =>
  WIDGET_ITEMS.find((item) => item.id === id);

/**
 * 이동 링크·타일이 가는 곳: 카드 내용의 주소(처방·투약) → 항목 주소(함수면 petSn으로 만듦). 카드가 비어도 같은 곳
 */
export const getMovePath = (item, content, petSn) =>
  content?.moveTo ??
  (typeof item.moveTo === 'function' ? item.moveTo(petSn) : item.moveTo);

/**
 * 이동 링크 state: 매일 기록은 건강 일지에서 그 항목을 고른 「오늘 기록하기」 모달을 바로 엶(HealthDiaryPage가 typeCd·isRecordOpen을 읽음, ※신규 정책).
 * 건강기록 화면끼리는 공통 카드가 아이를 유지
 */
export const getMoveState = (item) =>
  item.typeCd ? { typeCd: item.typeCd, isRecordOpen: true } : undefined;

/** 처음 추천 항목: 체중·식사량·음수량 (D4 수정) (※신규 정책) */
export const RECOMMENDED_IDS = ['weight', 'meal', 'water'];

/** 휴대폰(760px 미만)에서 그리지 않는 항목: 요약 띠와 같은 정보 (※신규 정책) */
export const MOBILE_HIDDEN_IDS = ['ckup', 'insp'];

/** 매일 기록 5개(건강 일지 [오늘 기록하기] 종류와 짝) */
export const DAILY_ITEMS = WIDGET_GROUPS[0].items;

/** 4묶음 순서로 정렬·중복 제거, 모르는 키는 버림 (D8) */
export const orderWidgetIds = (ids) =>
  WIDGET_ITEMS.map((item) => item.id).filter((id) => ids.includes(id));

/**
 * 받은 순서를 지키고 중복·모르는 키만 버림 (※신규 정책, 카드 순서 바꾸기)
 * - 저장된 카드 순서를 쓰는 곳(대시보드·편집 저장·건강 일지 [항목 추가])용. 4묶음 순서로 다시 정렬하지 않음
 */
export const keepWidgetOrder = (ids) => {
  const knownIds = WIDGET_ITEMS.map((item) => item.id);
  return ids.filter(
    (id, index) => knownIds.includes(id) && ids.indexOf(id) === index,
  );
};

/**
 * 서버 응답 widgets → 보이는 항목 id 배열(sortSeq 순, indctYn=true만). 모르는 코드는 버림
 */
export const toShownWidgetIds = (widgets) =>
  [...widgets]
    .sort((a, b) => a.sortSeq - b.sortSeq)
    .filter((widget) => widget.indctYn)
    .map(
      (widget) =>
        WIDGET_ITEMS.find((item) => item.dshbdWdgtCd === widget.dshbdWdgtCd)
          ?.id,
    )
    .filter((id) => id != null);

/**
 * 대시보드에서 뺀 항목 코드: 백엔드가 PUT에 공통코드 13개를 모두 담아야 받으므로 맨 뒤에 indctYn=false로 계속 보냄
 * - 케어리스트 HLTC0096 (※신규 정책, 대시보드에서 뺌)
 */
const RETIRED_WIDGET_CODES = ['HLTC0096'];

/**
 * 보이는 항목 id 배열 → PUT 본문 widgets(공통코드 13개 전부, 보낸 순서가 저장 순서)
 * - 고른 항목은 받은 순서대로 indctYn=true, 나머지는 4묶음 순서로 뒤에 indctYn=false, 뺀 항목은 맨 뒤에 indctYn=false
 */
export const toWidgetBody = (shownIds) => {
  const ids = keepWidgetOrder(shownIds);
  const hiddenIds = WIDGET_ITEMS.map((item) => item.id).filter(
    (id) => !ids.includes(id),
  );
  return [
    ...ids.map((id) => ({
      dshbdWdgtCd: findWidgetItem(id).dshbdWdgtCd,
      indctYn: true,
    })),
    ...hiddenIds.map((id) => ({
      dshbdWdgtCd: findWidgetItem(id).dshbdWdgtCd,
      indctYn: false,
    })),
    ...RETIRED_WIDGET_CODES.map((dshbdWdgtCd) => ({
      dshbdWdgtCd,
      indctYn: false,
    })),
  ];
};

/** 항목 이름을 '·'로 이은 문구. 받은 순서(저장 순서) 그대로 */
export const joinWidgetNames = (ids) =>
  keepWidgetOrder(ids)
    .map((id) => findWidgetItem(id).nm)
    .join('·');
