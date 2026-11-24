import { ExternalLink, MapPin, Navigation, Phone, X } from 'lucide-react';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import { detailUrl, formatDistance, openDetail, routeUrl } from './placeFormat';

export default function PlacePopup({ place, onClose }) {
  // 그냥 누르면 카드와 같은 작은 창으로 연다. Ctrl·Shift·휠 클릭은 브라우저 기본(새 탭)으로 둔다
  const handleDetailClick = (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0)
      return;
    event.preventDefault();
    openDetail(place);
  };

  return (
    <div
      role="dialog"
      aria-label={`${place.plcConm} 요약`}
      className="absolute bottom-8 left-1/2 z-[4] w-[min(360px,calc(100%-32px))] -translate-x-1/2 rounded-modal bg-white p-5 shadow-depth-sm max-[760px]:bottom-[calc(var(--sheet-peek)+16px)]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-2 top-2 grid size-8 place-items-center rounded-full text-muted hover:bg-surface-2 max-[760px]:right-1 max-[760px]:top-1 max-[760px]:size-11"
      >
        <X className="size-5" />
      </button>
      <span className="mb-1 block text-sm text-subtle">
        {place.plcClsfCdNm}
        {place.distance != null && ` · ${formatDistance(place.distance)}`}
      </span>
      <h3 className="pr-8 text-lg font-bold text-ink">
        <a
          href={detailUrl(place)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleDetailClick}
          className="hover:underline hover:underline-offset-[3px]"
        >
          {place.plcConm}
        </a>
      </h3>
      <dl className="mt-3 grid grid-cols-[20px_minmax(0,1fr)] gap-x-2 gap-y-2 text-sm text-ink-2">
        {place.rprsTelno && (
          <>
            <dt>
              <Phone className="size-[18px] text-subtle" />
            </dt>
            <dd>{place.rprsTelno}</dd>
          </>
        )}
        <dt>
          <MapPin className="size-[18px] text-subtle" />
        </dt>
        <dd>{place.plcAddr}</dd>
      </dl>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={detailUrl(place)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleDetailClick}
          className={BTN_PRIMARY}
        >
          상세보기
          <ExternalLink className="size-[18px]" />
        </a>
        <a
          href={routeUrl(place)}
          target="_blank"
          rel="noopener noreferrer"
          className={BTN_SECONDARY}
        >
          <Navigation className="size-[18px]" />
          길찾기
        </a>
      </div>
    </div>
  );
}
