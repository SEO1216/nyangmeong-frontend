import Badge from '@/components/Badge';
import Icon from '@/components/Icon';
import { formatMonthDayDot, getTodayYmd } from '@/utils/formatDate';
import CareItemMenu from './CareItemMenu';
import { toCareIcon } from './careIcons';
import {
  CARE_ZONE,
  getCareCycleName,
  getDueBadge,
  isCustomCareItem,
  isLinkedCareItem,
} from './careDue';

const BADGE_TONES = { today: 'brand', upcoming: 'gray', late: 'amber' };

/** 둘째 줄: 구역 · 주기 · 완료 시각·예정일 */
const getCareDetail = (item, isDone, doneHm) => {
  if (item.careZoneCd !== CARE_ZONE.REGULAR)
    return ['일상관리', '매일', isDone && doneHm].filter(Boolean).join(' · ');
  const dueLabel = item.nxtmPrnmntYmd
    ? formatMonthDayDot(item.nxtmPrnmntYmd)
    : null;
  const isLate = !isDone && dueLabel && item.nxtmPrnmntYmd < getTodayYmd();
  return [
    '정기관리',
    getCareCycleName(item),
    isDone && (doneHm ? `오늘 ${doneHm} 완료` : '오늘 완료'),
    dueLabel && (isLate ? `예정 ${dueLabel}` : `다음 ${dueLabel}`),
  ]
    .filter(Boolean)
    .join(' · ');
};

/**
 * [케어 항목 한 줄] (FN-HLT-003-12)
 * - 640px 미만은 항목마다 테두리 있는 둥근 칸(완료하면 칸 전체 초록). 투약 항목은 640px 미만 두 줄, 640px 이상은 [마지막 1회 취소]를 ⋮ 메뉴 앞에 둔 한 줄
 * - 본문 클릭 = 완료 체크. 오늘 할 케어의 완료 항목은 이름에 취소선 + 회색, 정기관리 오늘 완료는 취소선 없이 체크만 (※신규 정책)
 * - isDone·doneHm: 오늘 완료 여부와 완료 시각(목록 응답에 없어 CareList가 완료 기록으로 계산)
 * - 케어미션 배지: todayMsnYn인 줄에만. 포인트(msnPnt)는 주양육자에게만 내려옴 (※신규 정책)
 */
export default function CareTile({
  item,
  isDone,
  doneHm,
  onCheck,
  onCancelLastDose,
  onEdit,
  onDelete,
  className = '',
}) {
  const isDose = item.prscSn != null;
  const isLinked = isLinkedCareItem(item);
  const isRegular = item.careZoneCd === CARE_ZONE.REGULAR;
  /** 사용자 추가 항목은 수정·삭제, 기본 정기관리는 수정(주기만), 기본 일상관리·연동 항목은 메뉴 없음 */
  const canEdit = !isLinked && (!item.bscArtclYn || isRegular);
  const canDelete = isCustomCareItem(item);
  const dueBadge =
    isRegular && item.nxtmPrnmntYmd ? getDueBadge(item.nxtmPrnmntYmd) : null;
  const isStruck = isDone && !isRegular;
  const missionLabel = item.msnPnt != null ? `+${item.msnPnt}P` : '미션';

  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)_auto] content-start items-center border-b [grid-template-areas:'b_s'_'a_a'] max-sm:rounded-[10px] max-sm:border ${
        isDose
          ? "sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:[grid-template-areas:'b_a_s']"
          : ''
      } ${
        isDone
          ? 'border-line-soft max-sm:border-brand-500 max-sm:bg-brand-100'
          : 'border-line-soft max-sm:border-line max-sm:bg-white'
      } ${className}`}
    >
      <button
        type="button"
        aria-pressed={isDone}
        className="flex min-w-0 items-center gap-2.5 px-2 py-3 text-left [grid-area:b]"
        onClick={() => onCheck(item)}
      >
        <Icon
          name={isDone ? 'check_circle' : 'radio_button_unchecked'}
          filled={isDone}
          className={isDone ? 'text-brand-500' : 'text-line-strong'}
        />
        <span aria-hidden="true" className="grid place-items-center">
          <Icon
            name={toCareIcon(item.rprsIconId)}
            className={isStruck ? 'text-subtle' : 'text-muted'}
          />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span
            className={`truncate ${isStruck ? 'text-subtle line-through' : 'text-ink'}`}
          >
            {item.careArtclNm}
          </span>
          <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted tabular-nums">
            {isLinked && (
              <Badge tone={isDone ? 'white' : 'gray'}>케어리스트 연동</Badge>
            )}
            <span className="break-keep">
              {getCareDetail(item, isDone, doneHm)}
            </span>
          </span>
        </span>
        {isDose && item.mdcnEndYmd && (
          <span className="hidden text-sm whitespace-nowrap text-subtle tabular-nums sm:inline">
            ~{formatMonthDayDot(item.mdcnEndYmd)}
          </span>
        )}
        {isDose && (
          <span className="text-sm whitespace-nowrap text-ink-2 tabular-nums">
            {item.todayCmptnCnt}/{item.dayMdcnNmtm}회
          </span>
        )}
        {(item.todayMsnYn || dueBadge) && (
          <span className="flex shrink-0 flex-wrap items-center justify-end gap-1">
            {item.todayMsnYn && (
              <Badge
                tone={item.msnCmptnYn ? 'brand' : 'outline'}
                className="tabular-nums"
              >
                <Icon
                  name={item.msnCmptnYn ? 'check' : 'stars'}
                  className="text-sm"
                />
                {missionLabel}
              </Badge>
            )}
            {dueBadge && (
              <Badge tone={BADGE_TONES[dueBadge.tone]} className="tabular-nums">
                {dueBadge.label}
              </Badge>
            )}
          </span>
        )}
      </button>

      {/** ⋮ 메뉴: 완료 버튼 밖. 메뉴가 없는 줄도 같은 폭을 비워 오른쪽 끝 맞춤 */}
      <div className="mr-2 flex items-center [grid-area:s]">
        {canEdit ? (
          <CareItemMenu
            label={`${item.careArtclNm} 메뉴`}
            onEdit={() => onEdit(item)}
            onDelete={canDelete ? () => onDelete(item) : undefined}
          />
        ) : (
          <span aria-hidden="true" className="size-8" />
        )}
      </div>

      {/** 투약 항목: 640px 미만은 둘째 줄에 복용 종료일·마지막 1회 취소, 640px 이상은 종료일은 이름 줄에 두고 취소만 ⋮ 메뉴 앞 */}
      {isDose && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pr-2 pb-3 pl-[76px] [grid-area:a] sm:p-0 sm:pr-3">
          {item.mdcnEndYmd && (
            <span className="text-sm text-subtle tabular-nums sm:hidden">
              ~{formatMonthDayDot(item.mdcnEndYmd)}
            </span>
          )}
          <button
            type="button"
            disabled={item.todayCmptnCnt === 0}
            className="text-sm text-brand-600 hover:underline hover:underline-offset-3 disabled:opacity-40 disabled:hover:no-underline"
            onClick={() => onCancelLastDose(item)}
          >
            마지막 1회 취소
          </button>
        </div>
      )}
    </div>
  );
}
