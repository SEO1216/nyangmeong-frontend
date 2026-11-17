/**
 * [전환 버튼] 시안 .seg: 회색 바탕 안에서 고른 칸만 흰색으로 떠오름
 * - 일정 등록 모달 「일정 종류」, 관리 항목 입력칸(반복 유형·주기), 「케어 항목 관리」 모달 [고르기 | 수정]이 같이 사용
 * - options: [{ cd, nm }], selected: 고른 cd, isLocked: 전체 잠금
 */
export default function SegmentSwitch({
  options,
  selected,
  onSelect,
  isLocked = false,
  className = '',
}) {
  return (
    <div
      className={`flex h-10 rounded-[6px] border border-[#e6eaeb] bg-[#f1f3f4] p-[3px] ${className}`}
    >
      {options.map((option) => {
        const isSelected = selected === option.cd;
        return (
          <button
            key={option.cd}
            type="button"
            aria-pressed={isSelected}
            disabled={isLocked}
            className={`flex flex-1 items-center justify-center rounded-[4px] whitespace-nowrap ${
              isSelected
                ? 'bg-white font-semibold text-[#1e4a4c] shadow-[0_1px_2px_rgba(26,50,52,0.08),0_0_0_1px_rgba(40,90,92,0.18)]'
                : 'font-medium text-[#566465] hover:text-[#1a3234]'
            }`}
            onClick={() => onSelect(option.cd)}
          >
            {option.nm}
          </button>
        );
      })}
    </div>
  );
}
