import ProgressBar from '@/components/ProgressBar';
import StatLink from '@/components/StatLink';
import { PATHS } from '@/routes/paths';
import { usePointBalance } from '../queries';
import { getPercent } from '../shared/pointFormat';
import StatSkeleton from './StatSkeleton';

/** 오늘 미션 달성률은 포인트 요약(주양육 동물 전체)의 완료/전체로 낸다 */
export default function MissionSummaryCard() {
  const { data: point, isPending, isError } = usePointBalance();

  const percent = point
    ? getPercent(point.todayCmptnMsnCnt, point.todayMsnCnt)
    : null;

  if (isPending) return <StatSkeleton />;

  return (
    <StatLink
      to={PATHS.MYPAGE_POINTS}
      label="오늘의 케어미션"
      value={percent}
      unit="% 완료"
      emphasis
      note={isError ? '불러오지 못했어요' : undefined}
      footer={
        <ProgressBar value={percent ?? 0} label="오늘의 케어미션 달성률" />
      }
    />
  );
}
