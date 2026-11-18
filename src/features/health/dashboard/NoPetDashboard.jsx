import { Link } from 'react-router-dom';
import EmptyResult from '@/components/EmptyResult';
import Icon from '@/components/Icon';
import { BTN_PRIMARY } from '@/components/buttonStyles';
import { getRegisterPath } from '../shared/registerPath';

/**
 * [반려동물 0마리 대시보드 자리] (※신규 정책)
 * - 공용 빈 안내(EmptyResult) + [반려동물 등록]: 공통 반려동물 카드와 같은 마이페이지 등록 모달 경로(?register=1&returnTo=)
 * - returnTo: 등록하고 돌아오면 튜토리얼을 열도록 부모가 표시를 붙인 주소
 */
export default function NoPetDashboard({ returnTo }) {
  return (
    <section aria-label="반려동물 등록 안내">
      <EmptyResult
        icon={<Icon name="pets" className="text-page text-line-strong" />}
        title="등록된 반려동물이 없어요"
        description="반려동물을 등록하면 건강 대시보드에서 기록을 모아 볼 수 있어요"
      >
        <Link to={getRegisterPath(returnTo)} className={BTN_PRIMARY}>
          반려동물 등록
        </Link>
      </EmptyResult>
    </section>
  );
}
