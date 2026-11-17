import { useState } from 'react';
import Card from '@/components/Card';
import DropdownSelect from '@/components/DropdownSelect';
import Icon from '@/components/Icon';
import { addDays, formatMonthDayDot, getTodayYmd } from '@/utils/formatDate';
import { toCareIcon } from './careIcons';

const PAGE_SIZE = 10;
/** 조회기간: 건강 일지 「최근 건강기록」과 같은 값 */
const PERIOD_OPTIONS = [3, 7, 14];
const DEFAULT_PERIOD = 3;

// 최근 케어 기록(FN-HLT-003-12). 케어리스트 카드 아래의 별도 카드다(숨긴 항목의 지난 기록도 그대로 나온다, ※신규 정책). 아이콘을 누르면 그날 완료 기록이 취소되고, 마우스를 올리면 아이콘이 ✕로 바뀐다
// 조회기간(오늘을 포함한 최근 3·7·14일, 처음 3일) 안의 완료 기록만 보여 준다. 기간을 바꾸면 1페이지로 돌아간다 (※신규 정책)
// 날짜 10줄씩 페이지로 나눠 보여 준다. 기록을 취소해 줄어들면 마지막 페이지로 당겨 온다
// regularSns: 정기관리 항목 번호(완료 기록 응답에 구역이 없어 R 표시에 쓴다)
export default function CareRecordList({ records, regularSns, onCancel }) {
  const [page, setPage] = useState(1);
  const [periodDays, setPeriodDays] = useState(DEFAULT_PERIOD);
  const todayYmd = getTodayYmd();
  const startYmd = addDays(todayYmd, -(periodDays - 1));
  const dates = [...new Set(records.map((record) => record.cmptnYmd))]
    .filter((ymd) => ymd >= startYmd && ymd <= todayYmd)
    .sort()
    .reverse();
  const pageCount = Math.max(1, Math.ceil(dates.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageDates = dates.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const pagerClass =
    'grid h-9 min-w-9 place-items-center rounded-full px-2 font-medium';

  return (
    <Card
      title="최근 케어 기록"
      sub={
        /** 640px 미만은 조회기간 드롭다운과 겹쳐 여러 줄로 접히므로 숨김 (※신규 정책) */
        <span className="max-sm:hidden">일상관리·정기관리 완료 기록 통합</span>
      }
      action={
        <DropdownSelect
          label="조회기간"
          value={periodDays}
          options={PERIOD_OPTIONS.map((days) => ({
            value: days,
            label: `최근 ${days}일`,
          }))}
          className="w-32"
          onChange={(days) => {
            setPeriodDays(days);
            setPage(1);
          }}
        />
      }
    >
      {dates.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-[#b9c4c4]">
          <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
            <span className="grid size-10 place-items-center rounded-full bg-[#f4f6f6] text-[#667374]">
              <Icon name="task_alt" />
            </span>
            <p className="text-sm font-semibold text-[#1a3234]">
              최근 {periodDays}일 동안 완료한 케어가 없어요
            </p>
            <p className="text-sm text-[#566465]">
              위 케어 항목을 누르면 완료로 표시되고 여기에 날짜별로 쌓여요
            </p>
          </div>
        </div>
      ) : (
        <ul>
          {pageDates.map((ymd) => (
            <li
              key={ymd}
              className="flex items-start gap-3.5 border-b border-[#edf1f1] py-3.5 last:border-b-0"
            >
              <span className="w-[88px] flex-none text-[#3d4a4b] tabular-nums">
                {ymd === todayYmd
                  ? `오늘 · ${formatMonthDayDot(ymd)}`
                  : formatMonthDayDot(ymd)}
              </span>
              <span className="flex flex-wrap gap-x-3 gap-y-2">
                {records
                  .filter((record) => record.cmptnYmd === ymd)
                  .map((record) => (
                    <button
                      key={record.careCmptnHstrySn}
                      type="button"
                      aria-label={`${formatMonthDayDot(ymd)} ${record.careArtclNm} 완료 기록 취소`}
                      className="group inline-flex items-center gap-1 text-[#1a3234]"
                      onClick={() => onCancel(record)}
                    >
                      <span className="relative grid size-7 place-items-center rounded-full bg-[#ebf0f0] text-[#566465] group-hover:bg-[#fbeeec] group-hover:text-[#b4473a]">
                        <Icon
                          name={toCareIcon(record.rprsIconId)}
                          className="text-[18px] group-hover:hidden"
                        />
                        <Icon
                          name="close"
                          className="hidden text-[18px] group-hover:inline-flex"
                        />
                        {regularSns.has(record.careArtclSn) && (
                          <span
                            aria-hidden="true"
                            className="absolute -top-1 -left-1 grid size-4 place-items-center rounded-full bg-[#5f49b0] text-[13px] leading-none font-semibold text-white"
                          >
                            R
                          </span>
                        )}
                      </span>
                      {record.careArtclNm}
                    </button>
                  ))}
              </span>
            </li>
          ))}
        </ul>
      )}
      {pageCount > 1 && (
        <nav
          aria-label="최근 케어 기록 페이지"
          className="mt-6 flex items-center justify-center gap-1"
        >
          <button
            type="button"
            aria-label="이전 페이지"
            disabled={currentPage === 1}
            className={`${pagerClass} text-[#3d4a4b] hover:bg-[#ebf0f0] disabled:pointer-events-none disabled:text-[#b9c4c4]`}
            onClick={() => setPage(currentPage - 1)}
          >
            <Icon name="chevron_left" />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (number) => (
              <button
                key={number}
                type="button"
                aria-current={number === currentPage ? 'page' : undefined}
                className={`${pagerClass} ${
                  number === currentPage
                    ? 'bg-[#285a5c] font-bold text-white'
                    : 'text-[#3d4a4b] hover:bg-[#ebf0f0]'
                }`}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ),
          )}
          <button
            type="button"
            aria-label="다음 페이지"
            disabled={currentPage === pageCount}
            className={`${pagerClass} text-[#3d4a4b] hover:bg-[#ebf0f0] disabled:pointer-events-none disabled:text-[#b9c4c4]`}
            onClick={() => setPage(currentPage + 1)}
          >
            <Icon name="chevron_right" />
          </button>
        </nav>
      )}
    </Card>
  );
}
