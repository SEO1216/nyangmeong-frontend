import { useEffect, useState } from 'react';
import { KAKAO_MAP_KEY } from '@/api/env';

let loading;
/** kakao.maps.load 콜백이 끝난 뒤에만 true. 로딩 도중에는 LatLng만 있고 StaticMap 등이 아직 없을 수 있어 LatLng 유무로 판단하지 않는다 */
let isReady = false;

function loadKakao() {
  if (isReady) return Promise.resolve(window.kakao);
  if (!KAKAO_MAP_KEY) return Promise.reject(new Error('카카오 지도 키 없음'));
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=services`;
    script.onload = () =>
      window.kakao.maps.load(() => {
        isReady = true;
        resolve(window.kakao);
      });
    script.onerror = () => {
      loading = undefined;
      script.remove();
      reject(new Error('카카오 지도 SDK 로드 실패'));
    };
    document.head.appendChild(script);
  });
  return loading;
}

export default function useKakaoMap() {
  const [state, setState] = useState({ kakao: null, isError: false });

  useEffect(() => {
    let cancelled = false;
    loadKakao().then(
      (kakao) => !cancelled && setState({ kakao, isError: false }),
      () => !cancelled && setState({ kakao: null, isError: true }),
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
