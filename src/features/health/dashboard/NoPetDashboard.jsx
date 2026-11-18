import { Link } from 'react-router-dom';
import { BTN_PRIMARY } from '@/components/buttonStyles';
import EmptyBox from '../diary/EmptyBox';
import { getRegisterPath } from '../shared/registerPath';

/**
 * [반려동물 0마리 대시보드 자리] (※신규 정책)
 * - 등록 안내 점선 박스 + [반려동물 등록]: 공통 반려동물 카드와 같은 마이페이지 등록 모달 경로(?register=1&returnTo=)
 * - returnTo: 등록하고 돌아오면 튜토리얼을 열도록 부모가 표시를 붙인 주소
 */
export default function NoPetDashboard({ returnTo }) {
  return (
    <section aria-label="반려동물 등록 안내">
      <EmptyBox
        icon="pets"
        title="등록된 반려동물이 없어요"
        description="반려동물을 등록하면 건강 대시보드에서 기록을 모아 볼 수 있어요"
        action={
          <Link
            to={getRegisterPath(returnTo)}
            className={`${BTN_PRIMARY} mt-2`}
          >
            반려동물 등록
          </Link>
        }
      />
    </section>
  );
}
