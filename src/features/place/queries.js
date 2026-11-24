import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addPlaceBookmark,
  getPlaceBookmarks,
  removePlaceBookmark,
  searchPlaces,
} from './api';

export const placeKeys = {
  search: (cond) => ['places', 'search', cond],
  bookmarks: (plcClsfCd) => ['places', 'bookmarks', plcClsfCd],
};

/** 지도 범위의 검색 결과를 한 번에 받는다. cond는 카테고리와 영역만(상호명·정렬은 받은 목록 안에서 처리). enabled가 false면(내 위치를 찾는 중) 보내지 않는다 */
export const usePlaceSearchQuery = (cond, { enabled = true } = {}) =>
  useQuery({
    queryKey: placeKeys.search(cond),
    enabled,
    queryFn: () => searchPlaces(cond),
  });

export const usePlaceBookmarks = (plcClsfCd) =>
  useQuery({
    queryKey: placeKeys.bookmarks(plcClsfCd),
    queryFn: () => getPlaceBookmarks(plcClsfCd),
  });

/** 변수 { place, plcBkmkSn }: plcBkmkSn이 있으면 해제, 없으면 저장 */
export const useTogglePlaceBookmark = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ place, plcBkmkSn }) =>
      plcBkmkSn
        ? removePlaceBookmark(plcBkmkSn)
        : addPlaceBookmark(place.plcSn),
    onSuccess: (data, { place, plcBkmkSn }) =>
      qc.setQueryData(placeKeys.bookmarks(place.plcClsfCd), (prev = []) =>
        plcBkmkSn
          ? prev.filter((item) => item.plcBkmkSn !== plcBkmkSn)
          : [
              { ...place, plcBkmkSn: data.plcBkmkSn },
              ...prev.filter((item) => item.plcSn !== place.plcSn),
            ],
      ),
    onSettled: (data, error, { place }) =>
      qc.invalidateQueries({ queryKey: placeKeys.bookmarks(place.plcClsfCd) }),
  });
};
