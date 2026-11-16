import { api } from '@/api/axios';

/**
 * 장소 검색. 지도 범위의 결과를 한 번에 받는다(whole=true, 응답 content에 범위 전체·hasNext=false, 45곳을 넘을 수 있다).
 * 상호명 거르기·정렬은 받은 목록 안에서 하므로 keyword·page를 보내지 않고 거리순으로만 받는다
 */
export const searchPlaces = ({
  plcClsfCd,
  swLat,
  swLot,
  neLat,
  neLot,
  cntrLat,
  cntrLot,
}) =>
  api.get('/places', {
    params: {
      plcClsfCd,
      whole: true,
      sort: 'DISTANCE',
      swLat,
      swLot,
      neLat,
      neLot,
      cntrLat,
      cntrLot,
    },
  });

/** 내 즐겨찾기(카테고리별, 저장 최신순) */
export const getPlaceBookmarks = (plcClsfCd) =>
  api.get('/place-bookmarks', { params: { plcClsfCd } });

/** 저장. 응답 { plcBkmkSn, plcSn }, 이미 있으면 409 PLACE_BOOKMARK_ALREADY_EXISTS */
export const addPlaceBookmark = (plcSn) =>
  api.post('/place-bookmarks', { plcSn });

/** 해제. 없으면 404 */
export const removePlaceBookmark = (plcBkmkSn) =>
  api.delete(`/place-bookmarks/${plcBkmkSn}`);
