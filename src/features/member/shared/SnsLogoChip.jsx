import { GoogleLogo, KakaoLogo, NaverLogo } from '../login/SnsLogos';

/**
 * 제공자(snsOffrCd)별 로고와 바탕. 로그인 버튼용 로고라 네이버(흰색)·카카오(글자색)는 브랜드 색 바탕 위에 올린다.
 * 바탕은 모두 20px 정사각형이라 어느 제공자든 크기가 같다
 */
const PROVIDER_LOGO = {
  USRC0007: { Logo: NaverLogo, chip: 'bg-[#03A94D] [&>svg]:size-3' },
  USRC0008: {
    Logo: KakaoLogo,
    chip: 'bg-[#fee500] text-[#191600] [&>svg]:size-4',
  },
  USRC0009: { Logo: GoogleLogo, chip: '[&>svg]:size-5' },
};

/** SNS 제공자 로고 칩. 로고는 장식이라 옆에 제공자 이름 글자를 함께 둔다 */
export default function SnsLogoChip({ snsOffrCd, className = '' }) {
  const provider = PROVIDER_LOGO[snsOffrCd];
  if (!provider) return null;
  const Logo = provider.Logo;
  return (
    <span
      className={`inline-flex size-5 shrink-0 items-center justify-center rounded-xs ${provider.chip} ${className}`}
    >
      <Logo />
    </span>
  );
}
