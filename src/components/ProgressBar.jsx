/** 진행 막대: 높이 10px, 회색 바탕 위 청록 채움. value·max로 비율, label은 화면 읽기용 이름 */
export default function ProgressBar({
  value,
  max = 100,
  label,
  className = '',
}) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={`h-2.5 overflow-hidden rounded-full bg-surface-3 ${className}`}
    >
      <div
        className="h-full rounded-full bg-brand-500 transition-[width]"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
