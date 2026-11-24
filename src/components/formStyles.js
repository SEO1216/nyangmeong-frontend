/**
 * [공용 입력칸·라벨 클래스] UI 체크리스트 71: 회원정보(features/member/shared/profileStyles.js) 모양이 기준
 * - INPUT: 40px 입력칸, 6px 모서리, 포커스 청록 테두리 + 링, aria-invalid 빨간 테두리, disabled 회색
 * - TEXTAREA: INPUT과 같은 테두리·상태의 여러 줄 칸(높이 96px)
 * - LABEL: 라벨 글자(굵게, 필수 표시는 FieldError의 Required). HELP: 칸 아래 도움말
 */
export const INPUT =
  'block h-10 w-full rounded-md border border-input-line bg-white px-3 placeholder:text-placeholder hover:border-line-strong focus:border-brand-500 focus:ring-focus focus:outline-none aria-invalid:border-danger aria-invalid:focus:ring-error disabled:bg-surface-2 disabled:text-subtle';

export const TEXTAREA = `${INPUT} h-24 resize-none py-2.5`;

export const LABEL = 'flex items-center gap-0.5 leading-[1.4] font-semibold';

export const HELP = 'text-sm leading-normal text-muted';
