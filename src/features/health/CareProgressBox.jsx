import { Link } from 'react-router-dom';
import Icon from '@/components/Icon';
import { PATHS } from '@/routes/paths';

/**
 * [케어리스트 진행 상자] (※신규 정책)
 * - 1줄: 오늘 완료 수 / 케어리스트에 보이는 항목 수 + 진행 막대(마이페이지 케어미션과 같은 모양)
 * - 2줄: 오늘의 케어미션. 주양육자는 받은 포인트와 [미션 보기], 공동양육자는 적립 안내
 * - mission: { prmyYn, doneCount, totalCount, earnedPoint, totalPoint }, 못 불러오면 null -> 2줄 없음
 */
export default function CareProgressBox({ doneCount, totalCount, mission }) {
  const percent =
    totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const hasPoint = mission?.prmyYn && mission.earnedPoint != null;

  return (
    <div className="rounded-box bg-surface-2 px-5 pt-[22px] pb-4">
      <div className="flex items-baseline justify-between">
        <b className="text-[32px] leading-[1.2] tabular-nums">
          {doneCount}
          <small className="text-base font-semibold text-muted">
            {' '}
            / {totalCount} 케어 완료
          </small>
        </b>
        <span className="text-xl font-bold text-brand-600 tabular-nums">
          {percent}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="오늘 케어 진행률"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-surface-3"
      >
        <div className="h-full bg-brand-500" style={{ width: `${percent}%` }} />
      </div>
      {mission && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-line pt-3 text-sm text-muted">
          <p className="flex min-w-0 items-start gap-1.5">
            <Icon name="stars" className="text-lg text-brand-500" />
            <span className="break-keep tabular-nums">
              오늘의 케어미션{' '}
              <b className="text-ink">
                {mission.doneCount} / {mission.totalCount}
              </b>
              {hasPoint && (
                <>
                  {' '}
                  · 받은 포인트{' '}
                  <b className="text-brand-600">
                    {mission.earnedPoint.toLocaleString()}P
                  </b>{' '}
                  / {mission.totalPoint.toLocaleString()}P
                </>
              )}
              {!mission.prmyYn &&
                ' · 공동양육 중인 아이라 포인트는 주양육자에게 적립돼요'}
            </span>
          </p>
          {mission.prmyYn && (
            <Link
              to={PATHS.MYPAGE_POINTS}
              className="ml-auto inline-flex items-center font-semibold whitespace-nowrap text-brand-600 hover:underline hover:underline-offset-4"
            >
              미션 보기
              <Icon name="chevron_right" className="text-lg" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
