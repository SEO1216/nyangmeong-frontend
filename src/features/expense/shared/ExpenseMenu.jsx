import KebabMenu from '@/components/KebabMenu';

/**
 * [지출 ⋮ 메뉴] PC 날짜별 상세의 행 오른쪽 메뉴. 공용 KebabMenu(row 모양)
 * - [수정]·[삭제](빨간색)
 */
export default function ExpenseMenu({ onEdit, onDelete }) {
  return (
    <KebabMenu
      variant="row"
      label="지출 메뉴"
      items={[
        { label: '수정', onSelect: onEdit },
        { label: '삭제', onSelect: onDelete, isDanger: true },
      ]}
    />
  );
}
