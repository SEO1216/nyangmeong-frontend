/**
 * [관리자 페이지 틀] 가운데 정렬 폭과 제목 줄.
 * description: 제목 아래 설명 문구. actions: 제목 오른쪽 버튼
 */
export default function AdminPageFrame({
  title,
  description,
  actions,
  children,
}) {
  const renderHeader = () => {
    if (actions) {
      return (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-ink">{title}</h1>
          {actions}
        </div>
      );
    }
    if (description) {
      return (
        <>
          <h1 className="mb-2 text-2xl font-bold text-ink">{title}</h1>
          <p className="mb-5 text-sm leading-[22px] text-subtle">
            {description}
          </p>
        </>
      );
    }
    return <h1 className="mb-5 text-2xl font-bold text-ink">{title}</h1>;
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      {renderHeader()}
      {children}
    </div>
  );
}
