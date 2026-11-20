import { Check } from 'lucide-react';

/**
 * [둘러보기 목차 한 줄] 지금 장 흰 칸 + 초록 번호, 지난 장 체크, 남은 장 회색 번호
 * - state: 'current' | 'done' | 'next'
 * - 건강기록 둘러보기·메인 서비스 둘러보기가 같이 쓴다
 */
export default function TocButton({ no, title, state, onClick }) {
  const isCurrent = state === 'current';
  return (
    <button
      type="button"
      aria-current={isCurrent ? 'step' : undefined}
      className={`flex w-full items-center gap-2 rounded-box px-2 py-1.5 text-left text-sm ${
        isCurrent
          ? 'bg-white font-bold text-ink'
          : 'font-medium text-ink-2 hover:bg-surface-3'
      }`}
      onClick={onClick}
    >
      <span
        className={`grid size-6 shrink-0 place-items-center rounded-full text-badge font-bold ${
          isCurrent
            ? 'bg-brand-500 text-white'
            : state === 'done'
              ? 'bg-brand-50 text-brand-500'
              : 'bg-surface-3 text-muted'
        }`}
      >
        {state === 'done' ? (
          <Check className="size-3.5" aria-label="본 장" />
        ) : (
          no
        )}
      </span>
      <span className="min-w-0 truncate">{title}</span>
    </button>
  );
}
