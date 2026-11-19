import { Star } from 'lucide-react';
// label이 없으면 결과에 없는 즐겨찾기 핀(별)이다. 위치는 PlaceOverlay가 잡는다
// 물방울 모양은 돌린 뒤 가로만 75%로 좁힌다(글자는 그대로)
// 즐겨찾기는 결과에 있으면 번호, 없으면 별로 보이고 둘 다 목록의 즐겨찾기 별과 같은 노란색이다.
// 즐겨찾기 핀은 골라도 색은 그대로 크기만 키운다(일반 번호 핀은 고르면 짙은 색)
export default function PlacePin({
  place,
  label,
  isFavorite = !label,
  isSelected,
  onSelect,
}) {
  const color = isFavorite
    ? 'text-white before:bg-[#f5c518]'
    : isSelected
      ? 'text-white before:bg-ink'
      : 'text-white before:bg-brand-500';
  return (
    <button
      type="button"
      onClick={() => onSelect(place.plcSn)}
      aria-label={`${place.plcConm}${isFavorite ? ' 즐겨찾기' : ''} 핀`}
      className={`relative block h-12 w-9 drop-shadow-[0_3px_4px_rgba(26,50,52,0.3)] transition-transform before:absolute before:left-0 before:top-0 before:size-9 before:[transform:scaleX(0.75)_rotate(-45deg)] before:rounded-[50%_50%_50%_0] before:content-[''] hover:z-[3] hover:origin-bottom hover:scale-[1.18] ${color} ${
        isSelected ? 'z-[3] origin-bottom scale-[1.18]' : 'z-[1]'
      }`}
    >
      <span className="relative -top-[7px] grid h-9 w-9 place-items-center text-sm font-bold">
        {label ?? <Star className="size-4 fill-current" />}
      </span>
    </button>
  );
}
