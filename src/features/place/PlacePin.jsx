import { Star } from 'lucide-react';
// label이 없으면 결과에 없는 즐겨찾기 핀(별)이다. 위치는 PlaceOverlay가 잡는다
// 결과에 든 즐겨찾기는 번호를 그대로 두고 즐겨찾기 색(연노랑 바탕·초록 글자)으로 보인다
export default function PlacePin({
  place,
  label,
  isFavorite = !label,
  isSelected,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(place.plcSn)}
      aria-label={`${place.plcConm}${isFavorite ? ' 즐겨찾기' : ''} 핀`}
      className={`relative block h-12 w-10 drop-shadow-[0_3px_4px_rgba(26,50,52,0.3)] transition-transform before:absolute before:left-0.5 before:top-0 before:size-9 before:-rotate-45 before:rounded-[50%_50%_50%_0] before:border-2 before:border-white before:content-[''] hover:z-[3] hover:origin-bottom hover:scale-[1.18] ${
        isSelected
          ? 'z-[3] origin-bottom scale-[1.18] text-white before:bg-ink'
          : isFavorite
            ? 'z-[1] text-brand-500 before:bg-[#fbd85d]'
            : 'z-[1] text-white before:bg-brand-500'
      }`}
    >
      <span className="relative -top-[7px] grid h-9 w-10 place-items-center text-sm font-bold">
        {label ?? <Star className="size-5 fill-current" />}
      </span>
    </button>
  );
}
