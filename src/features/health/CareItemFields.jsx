import DatePicker from '@/components/DatePicker';
import Icon from '@/components/Icon';
import { formatYmdWeekday, getTodayYmd } from '@/utils/formatDate';
import {
  CARE_CYCLES,
  CARE_ZONE,
  CUSTOM_CYCLE,
  CYCLE_DAYS_ERROR,
  DEFAULT_CARE_ICON,
  MAX_CYCLE_DAYS,
  addCycle,
  isValidCycleDays,
} from './careDue';
import SegmentSwitch from './SegmentSwitch';
import FieldError from './diary/FieldError';
import CharCount from './shared/CharCount';

/** 아이콘 목록과 이름: 퍼블리싱 html/hlt-calendar.html의 관리 항목 추가 모달과 같음. "기타"는 기본 아이콘 */
const ICONS = [
  { name: 'brush', label: '빗질' },
  { name: 'cleaning_services', label: '청소' },
  { name: 'dentistry', label: '양치' },
  { name: 'bathtub', label: '목욕' },
  { name: 'hearing', label: '귀' },
  { name: 'content_cut', label: '발톱' },
  { name: 'medication', label: '투약' },
  { name: 'vaccines', label: '주사' },
  { name: 'sentiment_satisfied', label: '구강' },
  { name: DEFAULT_CARE_ICON, label: '기타 (기본 아이콘)' },
];
const MAX_NAME_LENGTH = 40;

const ZONES = [
  { cd: CARE_ZONE.DAILY, nm: '일상관리' },
  { cd: CARE_ZONE.REGULAR, nm: '정기관리' },
];

const LABEL_CLASS =
  'flex items-center gap-0.5 text-base leading-[1.4] font-semibold text-[#1a3234]';
const INPUT_CLASS =
  'block h-10 w-full rounded-[6px] border border-[#d3dae2] bg-white px-3 text-base leading-[1.4] text-[#1a3234] outline-none hover:border-[#b9c4c4] focus:border-[#285a5c] focus:shadow-[0_0_0_3px_rgba(40,90,92,0.18)]';
const HELP_CLASS = 'text-sm leading-normal text-[#566465]';

function Required() {
  return <span className="ml-0.5 font-bold text-[#b4473a]">*</span>;
}

function Optional() {
  return (
    <span className="ml-1 text-[13px] font-medium text-[#667374]">선택</span>
  );
}

/**
 * [관리 항목 입력칸] (FN-HLT-003-21~24·38)
 * - fields·onChange: careDue.js의 입력칸 값과 바뀐 칸
 * - isBasic: 기본 항목 -> 주기만 수정. isEdit: 마지막으로 한 날은 수정 Body에 없어 숨김
 * - isCycleOnly: 항목명·아이콘·반복 유형 칸과 다음 예정일 상자를 숨기고 주기 칸만(「케어 항목 관리」 모달의 기본 정기관리 주기 수정, ※신규 정책)
 * - lastCmptnYmd: 수정할 항목의 마지막 완료일(다음 예정일 계산용)
 */
export default function CareItemFields({
  fields,
  onChange,
  isBasic = false,
  isEdit = false,
  isCycleOnly = false,
  lastCmptnYmd = null,
  nameRef = null,
}) {
  const todayYmd = getTodayYmd();
  const isRegular = fields.careZoneCd === CARE_ZONE.REGULAR;
  const isCustomCycle = fields.careCycleCd === CUSTOM_CYCLE;
  const hasValidDays = isValidCycleDays(fields.cycleDrctInptDayCnt);
  const hasValidCycle = fields.careCycleCd && (!isCustomCycle || hasValidDays);
  /** 빈 칸은 버튼만 끄고, 값이 있는데 범위 밖일 때만 안내 */
  const showDaysError =
    isCustomCycle && fields.cycleDrctInptDayCnt !== '' && !hasValidDays;
  /** 비우면 오늘(등록일)부터 계산 */
  const nextDueYmd =
    isRegular && hasValidCycle
      ? addCycle(
          fields.lastCmptnYmd || lastCmptnYmd || todayYmd,
          fields.careCycleCd,
          fields.cycleDrctInptDayCnt,
        )
      : null;
  const nextDue = nextDueYmd && (
    <p className="rounded-xl bg-[#f4f6f6] px-4 py-3 tabular-nums">
      다음 예정일 {formatYmdWeekday(nextDueYmd)}
    </p>
  );

  return (
    <>
      {!isCycleOnly && (
        <>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASS}>
              항목명
              <Required />
            </span>
            <input
              ref={nameRef}
              value={fields.careArtclNm}
              maxLength={MAX_NAME_LENGTH}
              placeholder="예: 영양제"
              disabled={isBasic}
              className={`${INPUT_CLASS} disabled:bg-[#f4f6f6] disabled:text-[#667374]`}
              onChange={(event) =>
                onChange({ careArtclNm: event.target.value })
              }
            />
            {!isBasic && (
              <CharCount value={fields.careArtclNm} max={MAX_NAME_LENGTH} />
            )}
          </label>

          <fieldset className="flex flex-col gap-1.5">
            <legend className={`${LABEL_CLASS} mb-1.5`}>
              카테고리 대표 아이콘
              <Optional />
            </legend>
            <div className="grid grid-cols-5 gap-2">
              {ICONS.map((icon) => {
                const isSelected = fields.rprsIconId === icon.name;
                const isEtc = icon.name === DEFAULT_CARE_ICON;
                return (
                  <button
                    key={icon.name}
                    type="button"
                    title={icon.label}
                    aria-label={icon.label}
                    aria-pressed={isSelected}
                    disabled={isBasic}
                    className={`grid h-10 place-items-center rounded-[6px] border disabled:opacity-40 ${
                      isSelected
                        ? 'border-[#285a5c] bg-[#e9f2f2] text-[#1e4a4c]'
                        : `bg-white hover:border-[#b9c4c4] ${
                            isEtc
                              ? 'border-dashed border-[#e2e7e7] text-[#667374]'
                              : 'border-[#e2e7e7] text-[#3d4a4b]'
                          }`
                    }`}
                    onClick={() =>
                      onChange({ rprsIconId: isSelected ? null : icon.name })
                    }
                  >
                    <Icon name={icon.name} />
                  </button>
                );
              })}
            </div>
            <p className={HELP_CLASS}>고르지 않으면 기본 아이콘으로 추가돼요</p>
          </fieldset>

          <fieldset className="flex flex-col gap-1.5">
            <legend className={`${LABEL_CLASS} mb-1.5`}>
              반복 유형
              <Required />
            </legend>
            <SegmentSwitch
              options={ZONES}
              selected={fields.careZoneCd}
              isLocked={isBasic}
              onSelect={(careZoneCd) => onChange({ careZoneCd })}
            />
          </fieldset>
        </>
      )}

      {isRegular && (
        <>
          <fieldset className="flex flex-col gap-1.5">
            <legend className={`${LABEL_CLASS} mb-1.5`}>
              주기
              <Required />
            </legend>
            <SegmentSwitch
              options={CARE_CYCLES}
              selected={fields.careCycleCd}
              onSelect={(careCycleCd) => onChange({ careCycleCd })}
            />
            {isCustomCycle && (
              <>
                <div className="relative mt-2">
                  <input
                    type="number"
                    min={1}
                    max={MAX_CYCLE_DAYS}
                    value={fields.cycleDrctInptDayCnt}
                    placeholder="예: 10"
                    aria-label="반복 일수"
                    aria-invalid={showDaysError}
                    className={`${INPUT_CLASS} pr-16 tabular-nums aria-invalid:border-danger`}
                    onChange={(event) =>
                      onChange({ cycleDrctInptDayCnt: event.target.value })
                    }
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#667374]">
                    일마다
                  </span>
                </div>
                <p className={HELP_CLASS}>마지막으로 한 날부터 n일마다</p>
                {showDaysError && <FieldError>{CYCLE_DAYS_ERROR}</FieldError>}
              </>
            )}
          </fieldset>

          {isEdit ? (
            !isCycleOnly && nextDue
          ) : (
            <div className="flex flex-col gap-1.5">
              <label className="flex flex-col gap-1.5">
                <span className={LABEL_CLASS}>
                  마지막으로 한 날
                  <Optional />
                </span>
                <DatePicker
                  value={fields.lastCmptnYmd}
                  max={todayYmd}
                  onChange={(lastYmd) => onChange({ lastCmptnYmd: lastYmd })}
                />
              </label>
              <p className={HELP_CLASS}>
                마지막으로 한 날을 알려주시면 다음 예정일을 더 정확하게
                계산해요. 비우면 오늘부터 셉니다
              </p>
              {nextDue}
            </div>
          )}
        </>
      )}
    </>
  );
}
