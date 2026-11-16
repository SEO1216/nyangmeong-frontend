import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  LocateFixed,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
} from 'lucide-react';
import useKakaoMap from '@/hooks/useKakaoMap';
import PlaceOverlay from './PlaceOverlay';
import PlacePin from './PlacePin';
import PlacePopup from './PlacePopup';
const INITIAL_LEVEL = 6;
const SINGLE_LEVEL = 4;
const BOUNDS_PADDING = 80;
/** 카카오 지도에서 가장 넓게 보는 확대 수준 */
const MAX_LEVEL = 14;
/** 확대 애니메이션·부드러운 이동이 끝날 때까지 기다리는 시간 */
const ZOOM_MS = 450;
const PAN_MS = 650;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const floatCard = 'bg-white shadow-depth-md';
const toolButton =
  'grid size-11 place-items-center text-ink-2 hover:bg-surface-2 hover:text-ink';

// 지도 영역. 지도를 움직이면 '이 지역에서 다시 검색'이 뜬다. children은 모바일에서 지도 위에 얹는 검색창·칩이다
export default function PlaceMap({
  results,
  strayFavorites,
  selectedPlace,
  fitKey,
  homeArea,
  isReady,
  regionText,
  isMoved,
  isCollapsed,
  isSheetFull,
  onSelectPin,
  onClosePopup,
  onMoved,
  onResearch,
  onToggleCollapse,
  children,
}) {
  const { kakao, isError } = useKakaoMap();
  const containerRef = useRef(null);
  const fittedKeyRef = useRef(null);
  // 코드로 지도를 옮기는 중에는 zoom_changed를 사용자가 움직인 것으로 치지 않는다
  const isAutoMoveRef = useRef(false);
  // 이어지는 지도 이동(줌아웃 → 이동 → 줌인) 도중 새 이동이 오면 앞 이동의 남은 단계를 버린다
  const flightRef = useRef(0);
  // 진행 중인 이동이 마지막에 돌아갈 확대 수준
  const endLevelRef = useRef(null);
  const onMovedRef = useRef(onMoved);
  const [map, setMap] = useState(null);
  const [isSky, setIsSky] = useState(false);

  useEffect(() => {
    onMovedRef.current = onMoved;
  }, [onMoved]);

  // flight가 아직 마지막 이동이면 ms 뒤 fn을 부른다. 카카오는 애니메이션 확대 뒤 idle을 보내지 않을 때가 있어 시간으로 잇는다
  const later = (flight, ms, fn) =>
    setTimeout(() => {
      if (flightRef.current === flight) fn();
    }, ms);

  /**
   * latlng로 부드럽게 옮기고 endLevel 확대로 맞춘다. 카카오 panTo는 화면 밖 먼 곳이면 순간이동하므로,
   * 그럴 때는 목적지가 화면에 들어올 만큼 먼저 줌아웃하고 이동한 뒤 다시 줌인한다.
   * endLevel을 주지 않으면 이동을 시작할 때의 확대(앞 이동이 도중에 끊겼으면 그 이동의 목표)로 돌아온다
   */
  const flyTo = (target, latlng, endLevel) => {
    const flight = ++flightRef.current;
    const level = endLevel ?? endLevelRef.current ?? target.getLevel();
    endLevelRef.current = level;
    const step = (fn) => {
      isAutoMoveRef.current = true;
      fn();
    };
    const finish = () => {
      step(() => {
        if (target.getLevel() !== level) {
          target.setLevel(level, { animate: true });
        }
      });
      endLevelRef.current = null;
      // 마지막 확대 뒤 idle이 오지 않아도 사용자가 움직인 것을 다시 알아보게 한다
      later(flight, ZOOM_MS, () => {
        isAutoMoveRef.current = false;
      });
    };
    if (prefersReducedMotion()) {
      step(() => {
        target.setCenter(latlng);
        target.setLevel(level);
      });
      endLevelRef.current = null;
      return;
    }
    const center = target.getCenter();
    const bounds = target.getBounds();
    if (bounds.contain(latlng)) {
      step(() => target.panTo(latlng));
      later(flight, PAN_MS, finish);
      return;
    }
    // 목적지까지 거리가 화면 반쪽의 몇 배인지로 줌아웃할 단계를 정한다(한 단계에 두 배)
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const ratio = Math.max(
      (2 * Math.abs(latlng.getLat() - center.getLat())) /
        (ne.getLat() - sw.getLat()),
      (2 * Math.abs(latlng.getLng() - center.getLng())) /
        (ne.getLng() - sw.getLng()),
    );
    const outLevel = Math.min(
      target.getLevel() + Math.ceil(Math.log2(ratio * 1.2)),
      MAX_LEVEL,
    );
    step(() => target.setLevel(outLevel, { animate: true }));
    later(flight, ZOOM_MS, () => {
      step(() => target.panTo(latlng));
      later(flight, PAN_MS, finish);
    });
  };

  // 결과가 다 보이게 지도를 맞춘다(부드럽게 이동). 결과가 없으면 처음 영역(내 주변·전주시 대표 영역)을 보인다
  const fitPlaces = (target, places) => {
    if (places.length === 1) {
      flyTo(
        target,
        new kakao.maps.LatLng(places[0].plcLat, places[0].plcLot),
        SINGLE_LEVEL,
      );
      return;
    }
    flightRef.current += 1;
    endLevelRef.current = null;
    isAutoMoveRef.current = true;
    const bounds = new kakao.maps.LatLngBounds();
    if (places.length === 0) {
      bounds.extend(new kakao.maps.LatLng(homeArea.swLat, homeArea.swLot));
      bounds.extend(new kakao.maps.LatLng(homeArea.neLat, homeArea.neLot));
    } else {
      places.forEach(({ plcLat, plcLot }) =>
        bounds.extend(new kakao.maps.LatLng(plcLat, plcLot)),
      );
    }
    if (prefersReducedMotion()) {
      target.setBounds(
        bounds,
        BOUNDS_PADDING,
        BOUNDS_PADDING,
        BOUNDS_PADDING,
        BOUNDS_PADDING,
      );
      return;
    }
    target.panTo(bounds, BOUNDS_PADDING);
  };

  useEffect(() => {
    if (!kakao) return;
    const kakaoMap = new kakao.maps.Map(containerRef.current, {
      center: new kakao.maps.LatLng(homeArea.cntrLat, homeArea.cntrLot),
      level: INITIAL_LEVEL,
    });
    kakao.maps.event.addListener(kakaoMap, 'idle', () => {
      isAutoMoveRef.current = false;
    });
    kakao.maps.event.addListener(kakaoMap, 'dragend', () =>
      onMovedRef.current(),
    );
    kakao.maps.event.addListener(kakaoMap, 'zoom_changed', () => {
      if (!isAutoMoveRef.current) onMovedRef.current();
    });
    setMap(kakaoMap);

    // 목록을 접거나 펼쳐 지도 칸 크기가 바뀌면 타일을 다시 맞춘다
    const observer = new ResizeObserver(() => kakaoMap.relayout());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
    // 지도는 SDK가 준비됐을 때 한 번만 만든다. 처음 영역이 나중에 정해지면 새 검색 결과로 맞춘다(fitPlaces)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kakao]);

  useEffect(() => {
    if (!map) return;
    map.setMapTypeId(
      isSky ? kakao.maps.MapTypeId.HYBRID : kakao.maps.MapTypeId.ROADMAP,
    );
  }, [map, kakao, isSky]);

  // 위치를 찾는 동안 전주로 만든 지도를 찾은 처음 영역으로 옮긴다(처음 영역은 한 번만 바뀐다).
  // 결과가 없으면 아래에서 지도를 옮기지 않으므로 여기서 맞춰 둔다
  useEffect(() => {
    if (!map) return;
    isAutoMoveRef.current = true;
    map.setCenter(new kakao.maps.LatLng(homeArea.cntrLat, homeArea.cntrLot));
  }, [map, kakao, homeArea]);

  // 새 검색의 결과가 오면 한 번 맞춘다. 재검색·정렬로 결과가 바뀔 때는 지도를 그대로 둔다.
  // 결과가 없으면 지도를 옮기지 않고 검색한 그 자리에 둔다
  useEffect(() => {
    if (!map || !isReady || fittedKeyRef.current === fitKey) return;
    fittedKeyRef.current = fitKey;
    if (results.length > 0) fitPlaces(map, results);
    // 결과가 바뀔 때마다가 아니라 새 검색일 때만 맞춘다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, isReady, fitKey]);

  useEffect(() => {
    if (!map || !selectedPlace) return;
    flyTo(
      map,
      new kakao.maps.LatLng(selectedPlace.plcLat, selectedPlace.plcLot),
    );
    // 고른 장소가 바뀔 때만 옮긴다(flyTo는 그릴 때마다 새로 만들어진다)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, kakao, selectedPlace]);

  // 버튼을 누른 순간의 지도 영역과 중앙으로 다시 검색한다
  const handleResearch = () => {
    const bounds = map.getBounds();
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    const center = map.getCenter();
    onResearch({
      swLat: southWest.getLat(),
      swLot: southWest.getLng(),
      neLat: northEast.getLat(),
      neLot: northEast.getLng(),
      cntrLat: center.getLat(),
      cntrLot: center.getLng(),
    });
  };

  const zoom = (direction) => {
    map?.setLevel(map.getLevel() - direction, { animate: true });
  };

  return (
    <div className="relative min-w-0 overflow-hidden bg-[#f1f2ed] max-md:absolute max-md:inset-0">
      <div ref={containerRef} className="absolute inset-0 isolate" />
      {!map && (
        <p className="absolute inset-0 grid place-items-center text-sm text-muted">
          {isError ? '지도를 불러오지 못했어요' : '지도를 불러오는 중이에요'}
        </p>
      )}
      {map &&
        results.map((place, index) => (
          <PlaceOverlay
            key={place.plcSn}
            kakao={kakao}
            map={map}
            position={[place.plcLat, place.plcLot]}
            zIndex={selectedPlace?.plcSn === place.plcSn ? 3 : 1}
          >
            <PlacePin
              place={place}
              label={String(index + 1)}
              isSelected={selectedPlace?.plcSn === place.plcSn}
              onSelect={onSelectPin}
            />
          </PlaceOverlay>
        ))}
      {map &&
        strayFavorites.map((place) => (
          <PlaceOverlay
            key={place.plcSn}
            kakao={kakao}
            map={map}
            position={[place.plcLat, place.plcLot]}
            zIndex={selectedPlace?.plcSn === place.plcSn ? 3 : 1}
          >
            <PlacePin
              place={place}
              isSelected={selectedPlace?.plcSn === place.plcSn}
              onSelect={onSelectPin}
            />
          </PlaceOverlay>
        ))}

      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? '목록 펼치기' : '목록 접기'}
        className="absolute left-0 top-1/2 z-[4] -mt-7 hidden h-14 w-6 place-items-center rounded-r-md border border-l-0 border-line bg-white text-muted shadow-sm hover:text-ink md:grid"
      >
        <ChevronLeft
          className={`size-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
        />
      </button>

      {children}

      <div className="pointer-events-none absolute inset-x-4 top-4 z-[2] flex items-start justify-between gap-3 max-md:top-[116px]">
        <span
          className={`pointer-events-auto inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold text-ink ${floatCard}`}
        >
          <MapPin className="size-[18px] text-brand-500" />
          {regionText}
        </span>
        <div
          role="group"
          aria-label="지도 종류"
          className={`pointer-events-auto flex rounded-md p-[3px] max-md:hidden ${floatCard}`}
        >
          {[
            ['일반 지도', false],
            ['스카이뷰', true],
          ].map(([text, sky]) => (
            <button
              key={text}
              type="button"
              aria-pressed={isSky === sky}
              onClick={() => setIsSky(sky)}
              className={`h-[34px] rounded-sm px-3.5 text-sm ${
                isSky === sky
                  ? 'bg-brand-500 font-semibold text-white'
                  : 'font-medium text-muted'
              }`}
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      {isMoved && (
        <button
          type="button"
          onClick={handleResearch}
          className={`absolute left-1/2 top-[72px] z-[2] inline-flex h-11 -translate-x-1/2 items-center gap-1.5 rounded-md px-5 font-semibold text-brand-600 max-md:top-[164px] ${floatCard}`}
        >
          <RefreshCw className="size-5" />이 지도 영역에서 다시 검색
        </button>
      )}

      <div
        className={`absolute right-4 top-1/2 z-[2] flex -translate-y-1/2 flex-col gap-2 max-md:bottom-[calc(var(--sheet-peek)+16px)] max-md:top-auto max-md:translate-y-0 ${
          isSheetFull ? 'max-md:hidden' : ''
        }`}
      >
        <div className={`overflow-hidden rounded-card ${floatCard}`}>
          <button
            type="button"
            aria-label="처음 위치로"
            onClick={() => map && fitPlaces(map, results)}
            className={toolButton}
          >
            <LocateFixed className="size-[22px]" />
          </button>
        </div>
        <div
          className={`flex flex-col divide-y divide-line-soft overflow-hidden rounded-card max-md:hidden ${floatCard}`}
        >
          <button
            type="button"
            aria-label="지도 확대"
            onClick={() => zoom(1)}
            className={toolButton}
          >
            <Plus className="size-[22px]" />
          </button>
          <button
            type="button"
            aria-label="지도 축소"
            onClick={() => zoom(-1)}
            className={toolButton}
          >
            <Minus className="size-[22px]" />
          </button>
        </div>
      </div>

      {selectedPlace && (
        <div className={isSheetFull ? 'max-md:hidden' : ''}>
          <PlacePopup
            key={selectedPlace.plcSn}
            place={selectedPlace}
            onClose={onClosePopup}
          />
        </div>
      )}
    </div>
  );
}
