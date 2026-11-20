import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';

export const TEXT_LINK =
  'text-muted hover:underline hover:underline-offset-[3px]';

// 로그인·가입 계열 버튼. AuthField 입력칸(48px·둥글기 12)과 높이·둥글기를 맞춘다. 공용 버튼의 h-10·rounded-md를 덮어야 해서 !를 쓴다
const AUTH_SIZE = '!h-12 !rounded-xl';
export const AUTH_BTN_PRIMARY = `${BTN_PRIMARY} ${AUTH_SIZE}`;
export const AUTH_BTN_SECONDARY = `${BTN_SECONDARY} ${AUTH_SIZE}`;

// 입력칸 옆 버튼
export const SIDE_BTN = `${AUTH_BTN_SECONDARY} min-w-22 shrink-0 whitespace-nowrap`;
