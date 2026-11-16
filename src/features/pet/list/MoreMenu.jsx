import { MoreVertical } from 'lucide-react';
import { useState } from 'react';

/**
 * [⋮ 메뉴] 반려동물 슬라이드 카드(PetSlide)와 보낸 초대 행이 같이 쓴다
 * - items: [{ label, onSelect, isDanger }]
 * - 항목을 고르거나 바깥을 누르면 닫힘
 * - isPlainOnMobile: 모바일(≤760px)에서 테두리 없는 작은 점 버튼으로
 */
export default function MoreMenu({
  label,
  items,
  className = '',
  isPlainOnMobile = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const itemClass =
    'block w-full rounded-md px-3 py-2.5 text-left whitespace-nowrap hover:bg-surface-2';

  const choose = (action) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`grid size-10 place-items-center rounded-full border bg-white hover:border-line-strong hover:text-ink ${isOpen ? 'border-line-strong text-ink' : 'border-line text-ink-2'} ${isPlainOnMobile ? 'max-[760px]:size-8 max-[760px]:border-transparent max-[760px]:bg-transparent max-[760px]:hover:border-transparent' : ''}`}
      >
        <MoreVertical className="size-5" />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            role="menu"
            className="absolute top-[calc(100%+6px)] right-0 z-20 min-w-[168px] rounded-box border border-line bg-white p-1.5 shadow-depth-md"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => choose(item.onSelect)}
                className={`${itemClass} ${item.isDanger ? 'text-danger' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
