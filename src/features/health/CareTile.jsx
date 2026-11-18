import { PawPrint } from 'lucide-react';
import Badge from '@/components/Badge';
import Icon from '@/components/Icon';
import { formatMonthDayDot } from '@/utils/formatDate';
import { toCareIcon } from './careIcons';
import {
  CARE_ZONE,
  getCareCycleName,
  getDueBadge,
  isLinkedCareItem,
} from './careDue';

const BADGE_TONES = { today: 'brand', upcoming: 'gray', late: 'amber' };

/**
 * 둘째 줄 (※신규 정책)
 * - 일상관리: 안 했으면 없음, 체크하면 「오늘 완료」
 * - 정기관리: 「{주기} 주기 · MM.DD 예정」, 오늘 완료면 가운데에 「오늘 완료」(날짜는 새로 계산된 다음 예정일)
 * - 완료 시각(cmptnDt의 시:분)은 화면에 쓰지 않음
 * - isShort(760px 미만 정기관리): 「주기」「예정」 글자를 빼 「{주기} · MM.DD」, 오늘 완료면 「{주기} · 오늘 완료 · 다음 MM.DD」
 */
const getCareDetail = (item, isDone, isShort = false) => {
  if (item.careZoneCd !== CARE_ZONE.REGULAR) return isDone ? '오늘 완료' : null;
  const cycleName = getCareCycleName(item);
  const dueLabel = item.nxtmPrnmntYmd
    ? formatMonthDayDot(item.nxtmPrnmntYmd)
    : null;
  const parts = isShort
    ? [
        cycleName,
        isDone && '오늘 완료',
        dueLabel && (isDone ? `다음 ${dueLabel}` : dueLabel),
      ]
    : [
        cycleName && `${cycleName} 주기`,
        isDone && '오늘 완료',
        dueLabel && `${dueLabel} 예정`,
      ];
  return parts.filter(Boolean).join(' · ');
};

/**
 * [케어 항목 한 줄] (FN-HLT-003-12)
 * - 760px 미만은 항목마다 테두리 있는 둥근 칸(완료하면 칸 전체 초록). 투약 항목은 760px 미만 두 줄, 760px 이상은 [마지막 1회 취소]를 줄 오른쪽 끝에 둔 한 줄
 * - isMission: 오늘의 미션 묶음 줄. 줄 왼쪽 가장자리에 3px 세로 막대를 덧그림(들여쓰지 않음). 760px 이상은 줄이 붙어 있어 묶음 처음부터 끝까지 이어지고, 760px 미만은 칸마다 붙고 완료한 칸만 막대가 진한 색(warn) (※신규 정책)
 * - 줄에는 ⋮ 메뉴가 없음. 수정·삭제는 「케어 항목 관리」 모달에서만 (※신규 정책)
 * - 본문 클릭 = 완료 체크. 완료한 줄은 취소선 없이 줄 배경색과 이름·아이콘 색으로 표시 (※신규 정책)
 * - 모든 줄은 둘째 줄에 「케어리스트 연동」 배지가 있는 줄과 같은 최소 높이(74px). 둘째 줄이 없으면 이름이 세로 가운데. 760px 미만은 문구를 자르지 않아 둘째 줄이 감기면 그만큼 늘어남 (※신규 정책)
 * - isDone: 오늘 완료 여부(목록 응답에 없어 CareList가 완료 기록으로 계산)
 * - 케어미션 안 한 배지 아이콘은 마이페이지 케어미션과 같은 발바닥 (※신규 정책)
 * - 케어미션 배지: todayMsnYn인 줄에만. 포인트(msnPnt)는 주양육자에게만 내려옴 (※신규 정책)
 */
export default function CareTile({
  item,
  isDone,
  isMission = false,
  onCheck,
  onCancelLastDose,
  className = '',
}) {
  const isDose = item.prscSn != null;
  const isLinked = isLinkedCareItem(item);
  const isRegular = item.careZoneCd === CARE_ZONE.REGULAR;
  const dueBadge =
    isRegular && item.nxtmPrnmntYmd ? getDueBadge(item.nxtmPrnmntYmd) : null;
  const detail = getCareDetail(item, isDone);
  const shortDetail = getCareDetail(item, isDone, true);
  const missionLabel = item.msnPnt != null ? `+${item.msnPnt}P` : '미션';

  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)] content-start items-center border-b [grid-template-areas:'b'_'a'] max-[760px]:rounded-[10px] max-[760px]:border ${
        isDose
          ? "min-[760px]:grid-cols-[minmax(0,1fr)_auto] min-[760px]:[grid-template-areas:'b_a']"
          : ''
      } ${
        isDone
          ? 'border-brand-100 bg-brand-50 max-[760px]:border-brand-500 max-[760px]:bg-brand-100'
          : 'border-line-soft max-[760px]:border-line max-[760px]:bg-white'
      } ${
        isMission
          ? `relative before:absolute before:top-0 before:-bottom-px before:left-0 before:w-[3px] before:bg-warn-line before:content-[''] max-[760px]:overflow-hidden ${
              isDone ? 'max-[760px]:before:bg-warn' : ''
            }`
          : ''
      } ${className}`}
    >
      <button
        type="button"
        aria-pressed={isDone}
        className="flex min-h-[74px] min-w-0 items-center gap-2.5 px-2 py-3 text-left [grid-area:b]"
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
            className={isDone ? 'text-brand-600' : 'text-muted'}
          />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span
            className={`truncate ${isDone ? 'text-brand-600' : 'text-ink'}`}
          >
            {item.careArtclNm}
          </span>
          {(isLinked || detail) && (
            <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted tabular-nums">
              {/** 연동 표시: 760px 이상은 배지, 760px 미만은 폭을 아끼려고 핀 아이콘(대시보드 「항상 표시」와 같은 아이콘) (※신규 정책) */}
              {isLinked && (
                <>
                  <Badge
                    tone={isDone ? 'white' : 'gray'}
                    className="max-[760px]:hidden"
                  >
                    케어리스트 연동
                  </Badge>
                  <span
                    role="img"
                    aria-label="케어리스트 연동"
                    className="inline-flex shrink-0 min-[760px]:hidden"
                  >
                    <Icon name="push_pin" className="text-lg text-subtle" />
                  </span>
                </>
              )}
              {detail &&
                (detail === shortDetail ? (
                  <span className="break-keep">{detail}</span>
                ) : (
                  <>
                    <span className="break-keep max-[760px]:hidden">
                      {detail}
                    </span>
                    <span className="break-keep min-[760px]:hidden">
                      {shortDetail}
                    </span>
                  </>
                ))}
            </span>
          )}
        </span>
        {isDose && item.mdcnEndYmd && (
          <span className="hidden text-sm whitespace-nowrap text-subtle tabular-nums min-[760px]:inline">
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
                {item.msnCmptnYn ? (
                  <Icon name="check" className="text-sm" />
                ) : (
                  <PawPrint className="size-3.5" aria-hidden="true" />
                )}
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

      {/** 투약 항목: 760px 미만은 둘째 줄에 복용 종료일·마지막 1회 취소, 760px 이상은 종료일은 이름 줄에 두고 취소만 줄 오른쪽 끝 */}
      {isDose && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pr-2 pb-3 pl-[76px] [grid-area:a] min-[760px]:p-0 min-[760px]:pr-3">
          {item.mdcnEndYmd && (
            <span className="text-sm text-subtle tabular-nums min-[760px]:hidden">
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
