import { addDays, addMonths, diffDays, getTodayYmd } from '@/utils/formatDate';
import { toCareIcon } from './careIcons';

// 케어 구역 공통코드(HLTG13)
export const CARE_ZONE = { DAILY: 'HLTC0036', REGULAR: 'HLTC0037' };

// 케어 주기 공통코드(HLTG15)
export const CUSTOM_CYCLE = 'HLTC0042';

// 직접입력 일수는 1~365 정수(서버 @Min(1)·@Max(365)와 같음)
export const MAX_CYCLE_DAYS = 365;
export const CYCLE_DAYS_ERROR = `1~${MAX_CYCLE_DAYS} 사이 정수로 입력해 주세요`;
export const isValidCycleDays = (value) => {
  const days = Number(value);
  return (
    String(value).trim() !== '' &&
    Number.isInteger(days) &&
    days >= 1 &&
    days <= MAX_CYCLE_DAYS
  );
};

export const CARE_CYCLES = [
  { cd: 'HLTC0038', nm: '1주' },
  { cd: 'HLTC0039', nm: '2주' },
  { cd: 'HLTC0040', nm: '한달' },
  { cd: 'HLTC0041', nm: '1년' },
  { cd: CUSTOM_CYCLE, nm: '직접입력' },
];

/** 검진상세 반복 예방의 주기 이름 */
export const getCycleName = (item) =>
  item.rptCycleCd === CUSTOM_CYCLE
    ? `${item.rptCycleDayCnt}일`
    : CARE_CYCLES.find((cycle) => cycle.cd === item.rptCycleCd)?.nm;

/** 케어 항목의 주기 이름: 직접입력은 일수, 나머지는 서버가 준 이름 */
export const getCareCycleName = (item) =>
  item.careCycleCd === CUSTOM_CYCLE
    ? `${item.cycleDrctInptDayCnt}일`
    : item.careCycleCdNm;

export const addCycle = (ymd, careCycleCd, cycleDrctInptDayCnt) => {
  switch (careCycleCd) {
    case 'HLTC0038':
      return addDays(ymd, 7);
    case 'HLTC0039':
      return addDays(ymd, 14);
    case 'HLTC0040':
      return addMonths(ymd, 1);
    case 'HLTC0041':
      return addMonths(ymd, 12);
    default:
      return addDays(ymd, Number(cycleDrctInptDayCnt));
  }
};

// 정기관리 상태 배지. 지난 예정일은 오류가 아니라 안내라 빨강 대신 주황 "+n일"로 쓴다
export const getDueBadge = (nxtmPrnmntYmd) => {
  const days = diffDays(getTodayYmd(), nxtmPrnmntYmd);
  if (days === 0) return { label: '오늘', tone: 'today' };
  if (days > 0) return { label: `D-${days}`, tone: 'upcoming' };
  return { label: `+${-days}일`, tone: 'late' };
};

/** 케어리스트에 남겨야 하는 최소 항목 수 (※신규 정책) */
export const MIN_CARE_COUNT = 5;
export const MIN_CARE_ERROR = '케어리스트에는 항목을 5개 이상 남겨 주세요.';

/** 5개 미만 오류(400 INVALID_INPUT_VALUE, field indctYn) 여부 */
export const isMinCareError = (error) =>
  error?.fields?.[0]?.field === 'indctYn';

/** 케어 저장·삭제 오류 문구: 5개 미만이면 고정 문구, 그 밖은 서버 문구 */
export const getCareErrorMessage = (error) =>
  isMinCareError(error) ? MIN_CARE_ERROR : error.message;

/** 처방·반복 예방 연동 항목 여부: 케어리스트에 항상 표시 (※신규 정책) */
export const isLinkedCareItem = (item) =>
  item.prscSn != null || item.reptPrvntMngSn != null;

/** 직접 만든 항목 여부: 수정·삭제 가능 */
export const isCustomCareItem = (item) =>
  !item.bscArtclYn && !isLinkedCareItem(item);

export const DEFAULT_CARE_ICON = 'task_alt';

/** 관리 항목 입력칸의 빈 값 */
export const EMPTY_CARE_FIELDS = {
  careArtclNm: '',
  rprsIconId: null,
  careZoneCd: null,
  careCycleCd: null,
  cycleDrctInptDayCnt: '',
  lastCmptnYmd: '',
};

/** 케어 항목 -> 입력칸 값 */
export const toCareFields = (item) => ({
  careArtclNm: item.careArtclNm,
  rprsIconId: toCareIcon(item.rprsIconId),
  careZoneCd: item.careZoneCd,
  careCycleCd: item.careCycleCd ?? null,
  cycleDrctInptDayCnt:
    item.cycleDrctInptDayCnt != null ? String(item.cycleDrctInptDayCnt) : '',
  lastCmptnYmd: '',
});

const hasValidCycle = (fields) =>
  fields.careCycleCd != null &&
  (fields.careCycleCd !== CUSTOM_CYCLE ||
    isValidCycleDays(fields.cycleDrctInptDayCnt));

/** 입력칸 필수값 검사 */
export const isCareFieldsValid = (fields) =>
  fields.careArtclNm.trim() !== '' &&
  fields.careZoneCd !== null &&
  (fields.careZoneCd !== CARE_ZONE.REGULAR || hasValidCycle(fields));

/** 입력칸 값 -> 등록 Body */
export const toCareCreateBody = (fields) => {
  const isRegular = fields.careZoneCd === CARE_ZONE.REGULAR;
  return {
    careArtclNm: fields.careArtclNm.trim(),
    rprsIconId: fields.rprsIconId ?? DEFAULT_CARE_ICON,
    careZoneCd: fields.careZoneCd,
    careCycleCd: isRegular ? fields.careCycleCd : null,
    cycleDrctInptDayCnt:
      isRegular && fields.careCycleCd === CUSTOM_CYCLE
        ? Number(fields.cycleDrctInptDayCnt)
        : null,
    lastCmptnYmd: isRegular && fields.lastCmptnYmd ? fields.lastCmptnYmd : null,
  };
};

/**
 * 입력칸 값 -> 수정 Body(바뀐 칸만)
 * - 기본 항목은 주기만
 * - 정기관리 주기는 구역·종류·일수 중 하나라도 바뀌면 종류와 일수를 함께
 */
export const toCareUpdateBody = (fields, item) => {
  const body = {};
  if (!item.bscArtclYn) {
    if (fields.careArtclNm.trim() !== item.careArtclNm)
      body.careArtclNm = fields.careArtclNm.trim();
    const nextIcon = fields.rprsIconId ?? DEFAULT_CARE_ICON;
    if (nextIcon !== toCareIcon(item.rprsIconId)) body.rprsIconId = nextIcon;
    if (fields.careZoneCd !== item.careZoneCd)
      body.careZoneCd = fields.careZoneCd;
  }
  if (fields.careZoneCd === CARE_ZONE.REGULAR) {
    const days =
      fields.careCycleCd === CUSTOM_CYCLE
        ? Number(fields.cycleDrctInptDayCnt)
        : null;
    if (
      fields.careZoneCd !== item.careZoneCd ||
      fields.careCycleCd !== item.careCycleCd ||
      days !== (item.cycleDrctInptDayCnt ?? null)
    ) {
      body.careCycleCd = fields.careCycleCd;
      if (days != null) body.cycleDrctInptDayCnt = days;
    }
  }
  return body;
};
