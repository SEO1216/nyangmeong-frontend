import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PlaceCategoryNav from '@/features/place/PlaceCategoryNav';
import PlaceMap from '@/features/place/PlaceMap';
import PlacePanel from '@/features/place/PlacePanel';
import PlaceSearchForm from '@/features/place/PlaceSearchForm';
import { CATEGORIES, DEFAULT_CATEGORY } from '@/features/place/placeData';
import useBottomSheet from '@/features/place/useBottomSheet';
import usePlaceSearch from '@/features/place/usePlaceSearch';

export default function PlacePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const category = CATEGORIES.some(({ key }) => key === categoryParam)
    ? categoryParam
    : DEFAULT_CATEGORY;

  const place = usePlaceSearch(category, (next) =>
    setSearchParams({ category: next }),
  );
  const { attachContainer, ...sheet } = useBottomSheet();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { search } = place;

  // 핀이나 목록 항목으로 고르면 지도가 그 업체로 가고 팝업이 뜬다. 모바일은 시트를 내려 지도가 보이게 한다
  const handlePinSelect = (plcSn) => {
    place.selectPlace(plcSn, 'pin');
    sheet.setSheet('peek');
  };

  const handleListSelect = (plcSn) => {
    place.selectPlace(plcSn, 'list');
    sheet.setSheet('peek');
  };

  // 현재 지도 안에 있으면서 검색 결과에 없는 즐겨찾기는 번호 없는 별 핀으로 보인다.
  // 다시 검색한 영역 밖이어도 목록에서 고른 즐겨찾기는 지도가 그리로 가므로 핀을 보인다
  const strayFavorites = place.favorites.filter(
    (fav) =>
      (!place.isOutside(fav) || fav.plcSn === place.selectedPlace?.plcSn) &&
      !place.results.some((result) => result.plcSn === fav.plcSn),
  );

  return (
    <div
      ref={attachContainer}
      style={{ '--sheet-peek': `${sheet.peekY}px` }}
      className={`relative h-full border-t border-line bg-white min-[760px]:grid ${
        isCollapsed
          ? 'min-[760px]:grid-cols-[64px_0_minmax(0,1fr)] min-[1100px]:grid-cols-[72px_0_minmax(0,1fr)]'
          : 'min-[760px]:grid-cols-[64px_340px_minmax(0,1fr)] min-[1100px]:grid-cols-[72px_400px_minmax(0,1fr)]'
      }`}
    >
      <nav
        aria-label="장소 종류"
        className="relative z-[3] hidden flex-col items-center gap-1 border-r border-line bg-white py-3 min-[760px]:flex"
      >
        <PlaceCategoryNav
          variant="rail"
          category={category}
          onSelect={place.selectCategory}
        />
      </nav>

      <PlacePanel
        search={search}
        sort={place.sort}
        regionText={place.regionText}
        query={place.query}
        results={place.results}
        totalCount={place.totalCount}
        favorites={place.favorites}
        bookmarkSnOf={place.bookmarkSnOf}
        isOutside={place.isOutside}
        isCollapsed={isCollapsed}
        sheet={sheet}
        onSearch={place.submitSearch}
        onType={place.typeSearch}
        onSortChange={place.setSort}
        onSelectPlace={handleListSelect}
        onToggleFavorite={place.toggleFavorite}
      />

      <PlaceMap
        results={place.results}
        strayFavorites={strayFavorites}
        selectedPlace={place.selectedPlace}
        isFavorite={(target) => place.bookmarkSnOf(target) !== null}
        fitKey={search.fitKey}
        homeArea={place.homeArea}
        isReady={place.query.isSuccess}
        regionText={place.regionText}
        isMoved={search.isMoved}
        isCollapsed={isCollapsed}
        isSheetFull={sheet.isFull}
        onSelectPin={handlePinSelect}
        onClosePopup={place.closePlace}
        onMoved={place.markMoved}
        onResearch={place.researchHere}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] flex flex-col gap-2 px-4 pt-3 min-[760px]:hidden">
          <PlaceSearchForm
            q={search.q}
            category={search.category}
            onSearch={place.submitSearch}
            onType={place.typeSearch}
            className="pointer-events-auto rounded-md shadow-depth-sm"
          />
          <div
            role="group"
            aria-label="장소 종류"
            className="pointer-events-auto relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]"
          >
            <PlaceCategoryNav
              variant="chips"
              category={category}
              onSelect={place.selectCategory}
            />
          </div>
        </div>
      </PlaceMap>
    </div>
  );
}
