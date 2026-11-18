import { CircleCheckBig, ShoppingBag, TrendingUp } from 'lucide-react';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import LoadError from '@/components/LoadError';
import SkeletonCard from '@/components/SkeletonCard';
import { formatDate } from '@/utils/formatDate';
import { usePointBalance } from '../queries';
import { formatSignedPoint, getPercent } from '../shared/pointFormat';

const STAT =
  'flex min-w-0 flex-col gap-2 border-l border-line-soft px-5 py-5 text-left first:border-l-0 hover:bg-surface-2 max-[760px]:gap-1 max-[760px]:px-3 max-[760px]:py-3';

function Stat({ icon, label, value, unit, sub, onClick }) {
  return (
    <button type="button" onClick={onClick} className={STAT}>
      <span className="flex items-center gap-2 text-muted max-[760px]:text-xs max-[760px]:whitespace-nowrap [&>svg]:max-[760px]:hidden">
        {icon}
        {label}
      </span>
      <span className="text-[28px] leading-[1.2] font-bold tracking-[-0.02em] text-brand-600 tabular-nums max-[760px]:text-lg">
        {value}
        <small className="ml-1 text-base font-semibold text-muted">
          {unit}
        </small>
      </span>
      <span className="text-muted max-[760px]:text-xs">{sub}</span>
    </button>
  );
}

/** 화면 이동은 페이지에서 정해 전달 */
export default function PointSummary({
  todayYmd,
  onScrollTo,
  onGoHealth,
  onGoCharacter,
}) {
  const { data: point, isPending, isError, refetch } = usePointBalance();

  if (isPending)
    return (
      <div aria-busy="true">
        <SkeletonCard className="h-[297px] max-[760px]:h-[350px]" />
      </div>
    );
  if (isError)
    return (
      <LoadError
        message="포인트를 불러오지 못했어요"
        onRetry={refetch}
        className="rounded-card border border-line bg-white py-16"
      />
    );
  if (!point) return null;

  return (
    <section
      aria-label="포인트 관리 / 케어미션 요약"
      className="rounded-card border border-brand-100 bg-brand-50 p-5 min-[760px]:p-8"
    >
      <p className="mb-3 flex items-center justify-end gap-2 text-muted">
        <span className="size-2 rounded-full bg-brand-500" aria-hidden="true" />
        {formatDate(todayYmd)} 기준
      </p>
      <div className="grid gap-4 min-[1100px]:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
        <div className="flex items-center gap-5 rounded-modal border border-brand-100 bg-white px-6 py-5">
          <span className="grid size-14 shrink-0 place-items-center rounded-card bg-warn-soft text-warn">
            <b className="text-[28px] leading-none" aria-hidden="true">
              P
            </b>
          </span>
          <div>
            <p className="text-muted">보유 포인트</p>
            <p className="mt-1 text-[28px] leading-[1.2] font-bold text-brand-600 tabular-nums">
              {point.hldPnt.toLocaleString()}
              <small className="ml-1 text-base text-brand-500">P</small>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 overflow-hidden rounded-modal border border-brand-100 bg-white">
          <Stat
            icon={<TrendingUp className="size-4" aria-hidden="true" />}
            label="이번 달 적립"
            value={formatSignedPoint(point.monthEarnPnt).slice(0, -1)}
            unit="P"
            sub={`적립 ${point.monthEarnCnt}건`}
            onClick={() => onScrollTo('point-history')}
          />
          <Stat
            icon={<ShoppingBag className="size-4" aria-hidden="true" />}
            label="이번 달 사용"
            value={formatSignedPoint(-point.monthUsePnt).slice(0, -1)}
            unit="P"
            sub={`아이템 구매 ${point.monthUseCnt}건`}
            onClick={() => onScrollTo('point-history')}
          />
          <Stat
            icon={<CircleCheckBig className="size-4" aria-hidden="true" />}
            label="오늘 미션"
            value={point.todayCmptnMsnCnt}
            unit={`/ ${point.todayMsnCnt}`}
            sub={
              point.todayMsnCnt === 0
                ? '오늘 출제된 미션이 없어요'
                : `${point.todayMsnPetCnt}마리 · ${getPercent(point.todayCmptnMsnCnt, point.todayMsnCnt)}% 완료`
            }
            onClick={() => onScrollTo('care-mission')}
          />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onGoHealth} className={BTN_SECONDARY}>
          건강 일지
        </button>
        <button
          type="button"
          onClick={onGoCharacter}
          className={`${BTN_PRIMARY} max-[760px]:hidden`}
        >
          캐릭터 꾸미기
        </button>
      </div>
    </section>
  );
}
