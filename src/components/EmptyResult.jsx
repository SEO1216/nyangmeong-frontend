/**
 * 결과 없음 박스: 문구, 보조 문구, 아래 버튼(children)을 가운데 쌓기(실선 카드, UI 체크리스트 27)
 * isCompact: 카드 안 작은 자리용. 높이를 내용에 맞추고(기본은 안쪽 320px) 위아래 여백·간격을 줄인다
 */
export default function EmptyResult({
  icon,
  title,
  description,
  isCompact = false,
  children,
}) {
  return (
    <div
      className={`rounded-[14px] border border-line bg-white px-6 ${isCompact ? 'py-10' : 'py-14'}`}
    >
      <div
        className={`flex flex-col items-center justify-center text-center ${isCompact ? 'gap-4' : 'h-[320px] gap-8'}`}
      >
        <div className="flex flex-col items-center gap-2 text-muted">
          {icon}
          <p className="text-lg">{title}</p>
          {description && <p className="text-base">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
