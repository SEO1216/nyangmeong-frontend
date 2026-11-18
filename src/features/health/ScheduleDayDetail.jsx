import Badge from '@/components/Badge';
import Card from '@/components/Card';
import Icon from '@/components/Icon';
import { BTN_PRIMARY } from '@/components/buttonStyles';
import {
  formatMonthDayWeekday,
  formatTime,
  getHmOf,
  getTodayYmd,
  getYmdOf,
} from '@/utils/formatDate';
import {
  compareSchedules,
  getScheduleTone,
  getScheduleKindName,
  isHospital,
} from './scheduleTypes';

// 날짜 인라인 상세 카드(FN-HLT-003-31). petLabel은 제목 옆에 붙는 "전체 반려동물" 또는 고른 반려동물 이름이다
export default function ScheduleDayDetail({
  ymd,
  schedules,
  petLabel,
  onSelectSchedule,
  onCreate,
  className = '',
  bodyClassName = '',
}) {
  const todayYmd = getTodayYmd();
  const isPast = ymd < todayYmd;
  const sorted = schedules
    .filter((schedule) => getYmdOf(schedule.schdlDt) === ymd)
    .sort(compareSchedules);

  return (
    <Card
      as="h3"
      title={formatMonthDayWeekday(ymd)}
      sub={`${sorted.length}건 · ${petLabel}`}
      className={className}
      bodyClassName={bodyClassName}
      action={
        // 좁은 화면에서는 제목·부제가 잘리지 않게 ＋ 아이콘만 남긴다
        <button
          type="button"
          aria-label="새 일정 추가"
          className={`${BTN_PRIMARY} shrink-0 max-[760px]:w-10 max-[760px]:px-0`}
          onClick={onCreate}
        >
          <Icon name="add" className="text-lg min-[760px]:hidden" />
          <span className="max-[760px]:hidden">새 일정 추가</span>
        </button>
      }
    >
      {sorted.length === 0 ? (
        <div className="h-full rounded-[10px] border border-dashed border-line-strong">
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 py-6 text-center">
            <span className="grid size-10 place-items-center rounded-full bg-surface-2 text-subtle">
              <Icon name="calendar_month" />
            </span>
            <p className="text-sm text-muted">등록된 일정이 없어요</p>
          </div>
        </div>
      ) : (
        <>
          <ul>
            {sorted.map((schedule) => (
              <li key={schedule.schdlSn}>
                <button
                  type="button"
                  className="group flex w-full items-start gap-3 border-b border-line-soft py-3 text-left"
                  onClick={() => onSelectSchedule(schedule)}
                >
                  <span
                    aria-hidden="true"
                    className={`w-1 shrink-0 self-stretch rounded-full ${
                      getScheduleTone(schedule).bar
                    }`}
                  />
                  {schedule.hrInptYn && (
                    <span className="shrink-0 whitespace-nowrap text-subtle">
                      {formatTime(getHmOf(schedule.schdlDt))}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span
                      className={`group-hover:text-brand-600 ${
                        isPast ? 'text-subtle' : 'text-ink'
                      }`}
                    >
                      {schedule.petNm} · {getScheduleKindName(schedule)} ·{' '}
                      {isHospital(schedule)
                        ? schedule.hsptlNm
                        : schedule.schdlNm}
                    </span>
                    {isPast && isHospital(schedule) && (
                      <>
                        {' '}
                        <Badge
                          tone={schedule.ckupRcdCnt > 0 ? 'ok' : 'outline'}
                        >
                          {schedule.ckupRcdCnt > 0
                            ? '검진기록 있음'
                            : '검진기록이 없어요'}
                        </Badge>
                      </>
                    )}
                    {schedule.memoCn && (
                      <span className="block text-sm text-subtle">
                        {schedule.memoCn}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
