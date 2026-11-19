import { useState } from 'react';
import DropdownSelect from '@/components/DropdownSelect';
import DatePicker from '@/components/DatePicker';
import { getTodayYmd } from '@/utils/formatDate';
import {
  CARE_CYCLES,
  CUSTOM_CYCLE,
  CYCLE_DAYS_ERROR,
  isValidCycleDays,
} from '../careDue';
import FieldError, { Required } from '@/components/FieldError';
import { INPUT, LABEL } from '@/components/formStyles';
import FormModal from '../diary/FormModal';
import { useCreatePrevention } from '../queries';
import SegmentSwitch from '../SegmentSwitch';
import { PREVENTION_ITEMS } from './checkupTypes';

const REQUIRED = <Required />;

// 한달(HLTG15)
const DEFAULT_CYCLE = 'HLTC0040';

/**
 * [반복 예방 추가 모달]
 * - 예방 항목·반복 주기(직접입력이면 일수)·시작일 모두 필수, 시작일 기본값은 오늘 (FN-HLT-005-05)
 * - 입력한 시작일이 케어 캘린더 정기관리 항목의 첫 예정일
 */
export default function PreventionModal({ petSn, ckupRcdSn, onClose }) {
  const [prvntItmCd, setPrvntItmCd] = useState(PREVENTION_ITEMS[0].cd);
  const [rptCycleCd, setRptCycleCd] = useState(DEFAULT_CYCLE);
  const [rptCycleDayCnt, setRptCycleDayCnt] = useState('');
  const [startYmd, setStartYmd] = useState(getTodayYmd);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createPrevention = useCreatePrevention();
  const isCustom = rptCycleCd === CUSTOM_CYCLE;

  const errors = {
    days: isCustom && !isValidCycleDays(rptCycleDayCnt),
    start: startYmd === '',
  };
  const isInvalid = (field) => isSubmitted && errors[field];

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    createPrevention.mutate(
      {
        petSn,
        ckupRcdSn,
        reptPrvntArtclCd: prvntItmCd,
        reptCycleCd: rptCycleCd,
        cycleDrctInptDayCnt: isCustom ? Number(rptCycleDayCnt) : null,
        bgngYmd: startYmd,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <FormModal
      title="반복 예방 추가"
      isPending={createPrevention.isPending}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <label className="flex flex-col gap-1.5">
        <span className={LABEL}>예방 항목{REQUIRED}</span>
        <DropdownSelect
          value={prvntItmCd}
          options={PREVENTION_ITEMS.map((item) => ({
            value: item.cd,
            label: item.nm,
          }))}
          onChange={setPrvntItmCd}
        />
      </label>

      {/** 케어 항목 입력의 주기 칸과 같은 한 줄 버튼. 직접입력이면 바로 아래 일수 칸 */}
      <fieldset className="flex flex-col gap-1.5">
        <legend className={`${LABEL} mb-1.5`}>반복 주기{REQUIRED}</legend>
        <SegmentSwitch
          options={CARE_CYCLES}
          selected={rptCycleCd}
          onSelect={setRptCycleCd}
        />
        {isCustom && (
          <>
            <div className="relative mt-2">
              <input
                type="number"
                min="1"
                max="365"
                value={rptCycleDayCnt}
                placeholder="예: 10"
                aria-label="반복 일수"
                aria-invalid={isInvalid('days')}
                className={`${INPUT} pr-16 tabular-nums`}
                onChange={(event) => setRptCycleDayCnt(event.target.value)}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-subtle">
                일마다
              </span>
            </div>
            {isInvalid('days') && <FieldError>{CYCLE_DAYS_ERROR}</FieldError>}
          </>
        )}
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL}>시작일{REQUIRED}</span>
        <DatePicker
          value={startYmd}
          invalid={isInvalid('start')}
          onChange={setStartYmd}
        />
        <p className="text-sm text-muted">
          입력한 시작일이 케어리스트의 첫 예정일이 됩니다
        </p>
        {isInvalid('start') && <FieldError>시작일을 입력해 주세요</FieldError>}
      </label>
    </FormModal>
  );
}
