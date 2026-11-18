import { PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';
import Icon from '@/components/Icon';
import { PATHS } from '@/routes/paths';

const BOX_CLASS = 'flex min-w-0 flex-col rounded-box px-5 pt-4 pb-5';
const TITLE_CLASS = 'flex items-center gap-1.5 text-sm font-semibold';
const NUMBER_CLASS = 'text-[28px] leading-[1.2] tabular-nums';
const UNIT_CLASS = 'text-base font-semibold';
/** 막대는 상자 맨 아래에 붙임: 한쪽 문구가 두 줄이 돼도 두 막대 높이가 같음 */
const BAR_CLASS = 'mt-auto h-2.5 flex-none overflow-hidden rounded-full';

const toPercent = (doneCount, totalCount) =>
  totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

/**
 * [케어리스트 진행 상자] (※신규 정책)
 * - 같은 높이의 두 상자. 760px 미만은 위아래(케어리스트 위, 미션 아래)
 * - 왼쪽 「케어리스트」: 오늘 완료 수 / 케어리스트에 보이는 항목 수 + 진행 막대
 * - 오른쪽 「오늘의 케어미션 · 전체」: 주양육자는 받은 포인트와 상자 전체가 포인트 화면 링크, 공동양육자는 적립 안내만(누를 수 없음)
 * - mission: { prmyYn, doneCount, totalCount, earnedPoint, totalPoint }, 못 불러오면 null -> 케어리스트 상자가 전체 폭
 */
export default function CareProgressBox({ doneCount, totalCount, mission }) {
  const percent = toPercent(doneCount, totalCount);

  return (
    <div className={`grid gap-3 ${mission ? 'min-[760px]:grid-cols-2' : ''}`}>
      <div className={`${BOX_CLASS} bg-surface-2`}>
        <p className={`${TITLE_CLASS} text-muted`}>케어리스트</p>
        <div className="mt-1 mb-3 flex items-baseline justify-between gap-3">
          <b className={NUMBER_CLASS}>
            {doneCount}
            <small className={`${UNIT_CLASS} text-muted`}>
              {' '}
              / {totalCount} 완료
            </small>
          </b>
          <span className="text-lg font-bold text-brand-600 tabular-nums">
            {percent}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="오늘 케어 진행률"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className={`${BAR_CLASS} bg-surface-3`}
        >
          <div
            className="h-full bg-brand-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      {mission && <MissionBox mission={mission} />}
    </div>
  );
}

/**
 * 오늘의 케어미션 상자: 색은 index.css의 brand 토큰만
 * - 숫자 줄 아래에 미션 배지 안내 한 줄. 공동양육자의 적립 안내는 숫자 줄에 그대로 (※신규 정책)
 */
function MissionBox({ mission }) {
  const percent = toPercent(mission.doneCount, mission.totalCount);
  const hasPoint = mission.prmyYn && mission.earnedPoint != null;
  const body = (
    <>
      <p className={TITLE_CLASS}>
        <PawPrint className="size-[18px] flex-none" aria-hidden="true" />
        오늘의 케어미션 · 전체
        {mission.prmyYn && (
          <Icon name="chevron_right" className="ml-auto text-lg" />
        )}
      </p>
      <div className="mt-1 mb-1 flex flex-wrap items-baseline justify-between gap-x-3">
        <b className={NUMBER_CLASS}>
          {mission.doneCount}
          <small className={UNIT_CLASS}> / {mission.totalCount} 완료</small>
        </b>
        {hasPoint && (
          <span className="text-lg font-bold tabular-nums">
            {mission.earnedPoint.toLocaleString()}P /{' '}
            {mission.totalPoint.toLocaleString()}P
          </span>
        )}
        {!mission.prmyYn && (
          <span className="text-sm font-medium break-keep">
            포인트는 주양육자에게 적립돼요
          </span>
        )}
      </div>
      <p className="mb-3 flex items-center gap-1.5 text-sm font-medium break-keep">
        <PawPrint className="size-4 flex-none" aria-hidden="true" />
        배지가 붙은 항목이 오늘의 미션이에요
      </p>
      <div
        role="progressbar"
        aria-label="오늘 케어미션 진행률"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`${BAR_CLASS} bg-brand-100`}
      >
        <div className="h-full bg-brand-500" style={{ width: `${percent}%` }} />
      </div>
    </>
  );
  const boxClass = `${BOX_CLASS} bg-brand-50 text-brand-600`;

  return mission.prmyYn ? (
    <Link
      to={PATHS.MYPAGE_POINTS}
      className={`${boxClass} hover:shadow-[inset_0_0_0_1px_var(--color-brand-100)]`}
    >
      {body}
    </Link>
  ) : (
    <div className={boxClass}>{body}</div>
  );
}
