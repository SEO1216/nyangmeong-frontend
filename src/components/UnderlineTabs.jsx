/**
 * 밑줄 탭: 높이 48·18px, 고른 탭은 청록 글자 + 아래 막대. 탭 줄 아래에 1px 선(UI 체크리스트 69)
 * items: [{ id, label }], activeId, onSelect(id). 탭 패널 id는 item.id, 탭 버튼 id는 `${item.id}-tab`
 * label은 글자 대신 노드도 된다(예: 이름 + 건수)
 * isLineHidden: 탭 줄 아래 선을 없앤다(선을 감싸는 막대가 그릴 때)
 * isScrollable: 줄바꿈 대신 한 줄 가로 스크롤(탭이 많아 좁은 폭에서 넘칠 때)
 */
export default function UnderlineTabs({
  items,
  activeId,
  onSelect,
  label,
  isLineHidden = false,
  isScrollable = false,
  className = '',
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={`flex gap-1 ${isScrollable ? 'overflow-x-auto [scrollbar-width:none]' : 'flex-wrap'} ${isLineHidden ? '' : 'shadow-[inset_0_-1px_0_var(--color-line)]'} ${className}`}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            id={`${item.id}-tab`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={item.id}
            className={`relative inline-flex h-12 shrink-0 items-center px-4 text-lg whitespace-nowrap ${
              isActive
                ? "font-bold text-brand-500 after:absolute after:right-3 after:bottom-0 after:left-3 after:h-0.5 after:rounded-sm after:bg-brand-500 after:content-['']"
                : 'font-semibold text-muted hover:text-ink'
            }`}
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
