import { MapPinOff } from 'lucide-react';
import DropdownSelect from '@/components/DropdownSelect';
import EmptyResult from '@/components/EmptyResult';
import LoadError from '@/components/LoadError';
import Skeleton from '@/components/Skeleton';
import PlaceListItem from './PlaceListItem';
import PlaceSearchForm from './PlaceSearchForm';
import { SORT_OPTIONS } from './placeData';
import { PLACE_LIST_ID } from './placeFormat';

const groupTitle =
  'flex items-baseline gap-2 px-4 pt-4 text-sm font-semibold text-ink-2 min-[760px]:px-5';

export default function PlacePanel({
  search,
  sort,
  regionText,
  query,
  results,
  totalCount,
  favorites,
  bookmarkSnOf,
  isOutside,
  isCollapsed,
  sheet,
  onSearch,
  onType,
  onSortChange,
  onSelectPlace,
  onToggleFavorite,
}) {
  return (
    <section
      id={PLACE_LIST_ID}
      aria-label="장소 목록"
      style={{ '--sheet-y': `${sheet.sheetY}px` }}
      className={`relative z-[2] flex min-h-0 min-w-0 flex-col overflow-hidden border-r border-line bg-white max-[760px]:absolute max-[760px]:inset-x-0 max-[760px]:bottom-0 max-[760px]:z-[6] max-[760px]:h-[calc(100%-56px)] max-[760px]:translate-y-[calc(100%-var(--sheet-y))] max-[760px]:rounded-t-[20px] max-[760px]:border-0 max-[760px]:shadow-[0_-6px_24px_rgba(26,50,52,0.14)] ${
        sheet.isDragging
          ? ''
          : 'max-[760px]:transition-transform max-[760px]:duration-300 max-[760px]:ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none'
      } ${isCollapsed ? 'min-[760px]:invisible' : ''}`}
    >
      <button
        type="button"
        aria-label="목록 크기 바꾸기"
        onPointerDown={(event) => sheet.startDrag(event, true)}
        onClick={sheet.handleHandleClick}
        className="flex w-full cursor-grab touch-none flex-col items-center gap-2 pb-2 pt-3 before:h-1 before:w-10 before:rounded-sm before:bg-line-strong before:content-[''] min-[760px]:hidden"
      >
        <span className="text-sm text-subtle">
          {sheet.isFull ? '아래로 내려 지도 보기' : '위로 올려 목록 보기'}
        </span>
      </button>

      <div className="hidden flex-col gap-3 px-5 pb-4 pt-6 min-[760px]:flex">
        <h1 className="text-2xl font-bold leading-[1.3] tracking-[-0.02em] text-ink">
          반려동물 플레이스
        </h1>
        <PlaceSearchForm
          q={search.q}
          category={search.category}
          onSearch={onSearch}
          onType={onType}
        />
      </div>

      <div className="flex min-h-12 items-center justify-between gap-3 border-y border-line bg-surface-2 px-5 max-[760px]:border-t-0 max-[760px]:bg-white max-[760px]:px-4 min-[760px]:min-h-[52px]">
        <p
          onPointerDown={(event) => sheet.startDrag(event, false)}
          className="min-w-0 flex-1 touch-none truncate text-sm text-muted max-[760px]:cursor-grab"
        >
          <b className="font-semibold text-ink">{regionText}</b> · 결과{' '}
          {totalCount}곳
        </p>
        <DropdownSelect
          label="정렬"
          value={sort}
          size="sm"
          options={SORT_OPTIONS}
          className="w-[104px] shrink-0"
          onChange={onSortChange}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {favorites.length > 0 && (
          <section
            aria-labelledby="place-fav-title"
            className="border-b-8 border-surface-2"
          >
            <h2 id="place-fav-title" className={groupTitle}>
              내 즐겨찾기 <b className="text-brand-600">{favorites.length}</b>
              <small className="ml-auto text-sm font-normal text-subtle">
                상단 고정
              </small>
            </h2>
            <ul>
              {favorites.map((place) => (
                <PlaceListItem
                  key={place.plcSn}
                  place={place}
                  isFavorite
                  isStarred
                  isOutside={isOutside(place)}
                  isSelected={search.selected === place.plcSn}
                  shouldScroll={
                    search.selected === place.plcSn &&
                    search.selectedBy === 'pin'
                  }
                  onSelect={onSelectPlace}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="place-result-title">
          <h2 id="place-result-title" className={groupTitle}>
            검색 결과 <b className="text-brand-600">{totalCount}</b>
            {search.keyword && (
              <small className="ml-auto text-sm font-normal text-subtle">
                “{search.keyword}”
              </small>
            )}
          </h2>
          {query.isPending ? (
            <ul aria-label="검색 결과를 불러오는 중">
              {[0, 1, 2].map((index) => (
                <li
                  key={index}
                  className="border-b border-line-soft px-4 py-4 min-[760px]:px-5"
                >
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton lines={2} className="mt-3" />
                </li>
              ))}
            </ul>
          ) : query.isError ? (
            <LoadError
              message="검색 결과를 불러오지 못했어요"
              onRetry={() => query.refetch()}
              className="px-6 py-12"
            />
          ) : results.length === 0 ? (
            <div className="p-4">
              <EmptyResult
                isCompact
                icon={<MapPinOff className="size-8" />}
                title="이 지도 영역에 검색 결과가 없어요"
                description="지도를 옮기거나 검색어를 바꿔 보세요"
              />
            </div>
          ) : (
            <>
              <ul>
                {results.map((place, index) => (
                  <PlaceListItem
                    key={place.plcSn}
                    place={place}
                    letter={String(index + 1)}
                    isStarred={bookmarkSnOf(place) != null}
                    isSelected={search.selected === place.plcSn}
                    shouldScroll={
                      search.selected === place.plcSn &&
                      search.selectedBy === 'pin'
                    }
                    onSelect={onSelectPlace}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </ul>
              <p className="px-5 pb-10 pt-6 text-center text-sm text-subtle">
                마지막 검색 결과예요
              </p>
            </>
          )}
        </section>
      </div>
    </section>
  );
}
