const BASE =
  'inline-flex h-10 items-center justify-center gap-1.5 rounded-md border px-4 font-semibold disabled:cursor-not-allowed';

export const BTN_PRIMARY = `${BASE} border-transparent bg-brand-500 text-white hover:enabled:bg-brand-600 disabled:bg-surface-3 disabled:text-line-strong`;
export const BTN_SECONDARY = `${BASE} border-line bg-white hover:enabled:border-line-strong hover:enabled:bg-surface-2 disabled:border-transparent disabled:bg-surface-3 disabled:text-line-strong`;
/** 상세 화면 작성자 [수정] · [삭제]: 글자 버튼. 글자는 작아도 누르는 영역은 높이 32px. 삭제는 빨강 */
const TEXT_ACTION_SM =
  'inline-flex h-8 items-center px-1 text-sm font-medium transition-colors';
export const TEXT_ACTION = `${TEXT_ACTION_SM} text-muted hover:text-ink`;
export const TEXT_ACTION_DANGER = `${TEXT_ACTION_SM} text-danger hover:text-danger-600`;
export const BTN_DANGER = `${BASE} border-transparent bg-danger text-white hover:enabled:bg-danger-600 disabled:bg-surface-3 disabled:text-line-strong`;

/**
 * 칩(높이 36·14px·좌우 14). 기본(안 고름)은 흰 바탕 + 선. 선택 모양은 쓰임에 따라 둘 중 하나
 * CHIP_ON: 항목을 고르는 칩(청록 채움 + 흰 글자)
 * FILTER_CHIP_ON: 내용을 걸러 보는 필터 칩(연한 바탕 + 연한 테두리, 건강기록·케어미션)
 */
const CHIP_BASE =
  'inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-full border px-3.5 text-sm whitespace-nowrap transition-colors disabled:cursor-not-allowed';
export const CHIP = `${CHIP_BASE} border-line bg-white text-ink hover:enabled:bg-surface-2`;
export const CHIP_ON = `${CHIP_BASE} border-transparent bg-brand-500 font-semibold text-white`;
export const FILTER_CHIP = CHIP;
export const FILTER_CHIP_ON = `${CHIP_BASE} border-brand-100 bg-brand-50 font-semibold text-brand-600`;
