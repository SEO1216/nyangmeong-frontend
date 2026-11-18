const TONES = {
  brand: 'bg-brand-50 text-brand-600',
  gray: 'bg-surface-2 text-tone-gray-fg',
  amber: 'bg-tone-amber-bg text-tone-amber-fg',
  mine: 'bg-accent-300 text-ink',
  white: 'bg-white text-brand-600',
  ok: 'bg-tone-green-bg text-tone-green-fg before:size-1.5 before:rounded-full before:bg-current before:content-[""]',
  outline: 'bg-white text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)]',
};

// 알약 모양 뱃지. 높이·여백·글자는 퍼블리싱 시안의 .badge와 같다(24px, 위 1.5px·옆 10px)
// bordered: 글자색 알파 0.1의 안쪽 1px 테두리(커뮤니티의 색 있는 배지). 크기는 그대로
export default function Badge({
  tone = 'gray',
  bordered = false,
  className = '',
  children,
}) {
  return (
    <span
      className={`inline-flex h-6 items-center gap-1 rounded-full px-2.5 pt-[1.5px] align-middle text-badge leading-none font-semibold whitespace-nowrap ${TONES[tone]} ${bordered ? 'ring-1 ring-current/10 ring-inset' : ''} ${className}`}
    >
      {children}
    </span>
  );
}
