import { useId, useState } from 'react';
import Icon from '@/components/Icon';

/**
 * [안내 ⓘ] 마우스를 올리면(hover 기기) 보이고, 누르면 열고 닫음(터치 화면)
 * - 포커스가 빠지거나 Esc를 누르면 닫음
 * - AI 건강분석 리포트 고정 안내와 지속 관찰 크기 변화 그래프 안내가 같이 사용 (※신규 정책, 2026-11-20)
 * - label: ⓘ 버튼의 aria-label, children: 말풍선 내용
 * - tipClassName: 말풍선 폭(기본 w-72). 지속 관찰은 390px에서 화면 밖으로 나가지 않게 760px 미만 w-64 (※신규 정책, 2026-11-20)
 */
export default function NoticeInfo({ label, tipClassName = 'w-72', children }) {
  const [isOpen, setIsOpen] = useState(false);
  const noticeId = useId();

  return (
    <span
      className="group relative inline-flex"
      onBlur={() => setIsOpen(false)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setIsOpen(false);
      }}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        aria-describedby={noticeId}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex rounded-sm text-subtle hover:text-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        <Icon name="info" className="text-lg" />
      </button>
      <span
        id={noticeId}
        role="tooltip"
        className={`absolute top-full left-0 z-10 mt-2 ${tipClassName} rounded-box border border-line bg-white px-4 py-3 text-xs leading-[1.6] font-normal text-muted shadow-depth-sm [@media(hover:hover)]:group-hover:block ${isOpen ? 'block' : 'hidden'}`}
      >
        {children}
      </span>
    </span>
  );
}
