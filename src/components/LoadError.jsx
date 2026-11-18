import { BTN_PRIMARY } from './buttonStyles';

/**
 * [조회 오류 안내] 문구와 [다시 시도] 버튼.
 * className: 여백·테두리를 바꿀 때 쓴다(기본 py-16)
 */
export default function LoadError({ message, onRetry, className = 'py-16' }) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center gap-3 ${className}`}
    >
      <p className="text-base text-subtle">{message}</p>
      <button type="button" className={BTN_PRIMARY} onClick={onRetry}>
        다시 시도
      </button>
    </div>
  );
}
