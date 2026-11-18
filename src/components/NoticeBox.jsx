/** 안내·주의 상자 톤: info(회색 바탕), warn(노란 바탕 + 선), danger(연한 빨강 바탕) */
const TONES = {
  info: 'bg-surface-2 text-muted',
  warn: 'border border-warn-line bg-warn-soft text-warn',
  danger: 'bg-danger-soft text-danger',
};

/** 안내·주의 상자: 둥글기 10px(rounded-box), 안쪽 여백 16·12, 14px 글자 */
export default function NoticeBox({ tone = 'info', className = '', children }) {
  return (
    <div
      className={`rounded-box px-4 py-3 text-sm leading-[1.6] ${TONES[tone]} ${className}`}
    >
      {children}
    </div>
  );
}
