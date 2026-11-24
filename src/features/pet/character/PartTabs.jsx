import { CHIP, CHIP_ON } from '@/components/buttonStyles';
import { ITEM_PART_OPTIONS } from '../shared/petCodes';

export const ALL = 'ALL';

/** 보관함·상점 공용 탭 이름·순서: 전체 · 머리 · 얼굴 · 목 · 의상 · 가방 */
const TABS = [{ code: ALL, name: '전체' }, ...ITEM_PART_OPTIONS];

/**
 * [부위 탭] 공용 칩(CHIP·CHIP_ON). 보관함(FN-MYP-010-14)·상점(FN-MYP-011-02) 공용
 * - 모바일에서 탭 줄이 칸을 넓히지 않도록 폭을 0에서 부모 폭까지로 둔다(줄 안에서만 가로 스크롤)
 */
export default function PartTabs({ value, onChange }) {
  return (
    <div
      role="group"
      aria-label="부위"
      className="flex flex-wrap gap-2 max-[760px]:w-0 max-[760px]:min-w-full max-[760px]:flex-nowrap max-[760px]:overflow-x-auto max-[760px]:[scrollbar-width:none] max-[760px]:[&::-webkit-scrollbar]:hidden"
    >
      {TABS.map((tab) => (
        <button
          key={tab.code}
          type="button"
          aria-pressed={tab.code === value}
          onClick={() => onChange(tab.code)}
          className={tab.code === value ? CHIP_ON : CHIP}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
