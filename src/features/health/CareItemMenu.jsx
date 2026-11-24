import KebabMenu from '@/components/KebabMenu';

/**
 * [케어 항목 ⋮ 메뉴] 케어리스트 줄 끝 메뉴. 공용 KebabMenu(row 모양)에 항목만 만들어 넘김
 * - [수정]·[삭제](빨간색). onDelete를 안 넘기면 [삭제]를 그리지 않음
 * - leadingItems: [수정] 앞에 붙일 항목 [{ label, onSelect }] (지속 관찰 [사진 원본 보기], 추가 요청). 안 넘기면 지금과 같음
 * - onEdit를 안 넘기면 [수정]을 그리지 않음 (건강 대시보드 ⋮ 메뉴, 카드 순서 바꾸기)
 */
export default function CareItemMenu({
  label,
  onEdit,
  onDelete,
  leadingItems = [],
}) {
  const items = [
    ...leadingItems,
    ...(onEdit ? [{ label: '수정', onSelect: onEdit }] : []),
    ...(onDelete
      ? [{ label: '삭제', onSelect: onDelete, isDanger: true }]
      : []),
  ];
  return <KebabMenu variant="row" label={label} items={items} />;
}
