/**
 * 썸네일 주소(언론사 URL 또는 공개 파일)로 표시. 주소가 없으면 아무것도 그리지 않는다
 * - 불러오지 못하면 onError로 알려 부모가 칸(출처 캡션 포함)을 접는다. 점선 자리 표시는 없다
 * - 목록 칸(기본): 이미지는 잘리거나 늘어나지 않고 전체가 보인다. 칸보다 작으면 원래 크기로 가운데, 크면 칸에 맞춰 줄인다.
 *   남는 자리는 같은 이미지를 크게 늘려 흐리게 깐다(칸 위치는 부모가 className으로 정한다: absolute inset-0 등)(사진 비율이 칸과 달라도·로고처럼 작아도 어색하지 않게)
 * - natural: 원본 비율·크기 그대로, 본문보다 크면 줄이고 작으면 가운데(상세)
 */
export default function NewsThumb({
  src,
  className = '',
  natural = false,
  onError,
}) {
  if (!src) return null;
  if (natural) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={onError}
        className="mx-auto block h-auto max-w-full rounded-[14px]"
      />
    );
  }
  return (
    <span
      className={`block overflow-hidden rounded-[10px] bg-surface-2 ${className}`}
    >
      {/* 흐린 배경: 같은 주소라 요청은 한 번이고, 장식이라 화면 읽기에서 뺀다 */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        referrerPolicy="no-referrer"
        className="absolute inset-0 size-full scale-125 object-cover opacity-80 blur-xl"
      />
      <img
        src={src}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={onError}
        className="absolute inset-0 m-auto max-h-full max-w-full"
      />
    </span>
  );
}
