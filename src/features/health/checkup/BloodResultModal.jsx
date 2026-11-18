import { useState } from 'react';
import { showToast } from '@/components/toastStore';
import FormModal from '../diary/FormModal';
import { findBloodItem } from '../labInput/bloodItems';
import { DIRECT } from '../labInput/ItemSelect';
import LabItemForm from '../labInput/LabItemForm';
import { getSkippedNames, toInspectionValue } from '../labInput/labRows';
import {
  getLabNumberError,
  getLabRangeError,
  toInputText,
} from '../numberFormat';
import { useCreateInspections, useUpdateInspection } from '../queries';
import { getInspectionName } from './checkupTypes';

const EMPTY_FORM = {
  item: '',
  directNm: '',
  val: '',
  unit: '',
  rangeMin: '',
  rangeMax: '',
  memo: '',
};

const toText = (value) => (value == null ? '' : String(value));

/** 저장된 혈액검사 행 → 입력칸 값(검사 수치 입력 화면의 수정과 같은 규칙) */
const toEditForm = (item) => {
  const name = getInspectionName(item);
  return {
    item: findBloodItem(name) ? name : DIRECT,
    directNm: findBloodItem(name) ? '' : name,
    val: toInputText(item.rsltNvl),
    unit: toText(item.unitNm),
    rangeMin: toInputText(item.refLlmtNvl),
    rangeMax: toInputText(item.refUplmtNvl),
    memo: toText(item.memoCn),
  };
};

/**
 * [검사 수치 추가·수정 모달]
 * - 검사 결과 탭의 [검사 수치 추가] → 빈 칸, 혈액검사 행 클릭 → 값이 채워진 수정 (FN-HLT-007-01·02·03과 같은 규칙)
 * - 수정이면 검사 항목은 바꿀 수 없음
 * - registeredNames: 이미 등록된 항목 이름 (같은 항목 재입력 불가)
 */
export default function BloodResultModal({
  petSn,
  ckupRcdSn,
  item,
  registeredNames,
  onClose,
}) {
  const isEdit = item != null;
  const [form, setForm] = useState(() =>
    isEdit ? toEditForm(item) : EMPTY_FORM,
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createInspections = useCreateInspections();
  const updateInspection = useUpdateInspection();
  const isPending = createInspections.isPending || updateInspection.isPending;

  const itemName = form.item === DIRECT ? form.directNm.trim() : form.item;
  const errors = {};
  if (itemName === '') errors.item = '검사 항목을 선택해 주세요';
  else if (!isEdit && registeredNames.has(itemName)) {
    errors.item = `이미 등록된 항목입니다: ${itemName}`;
  }
  if (form.val.trim() === '') errors.val = '검사 결과값을 입력해 주세요';
  else if (getLabNumberError(form.val)) {
    errors.val = getLabNumberError(form.val);
  }
  if (form.unit.trim() === '') errors.unit = '단위를 입력해 주세요';
  const rangeError = getLabRangeError(form.rangeMin, form.rangeMax);
  if (rangeError) errors.range = rangeError;

  const changeForm = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    const value = {
      rsltNvl: Number(form.val),
      unitNm: form.unit.trim(),
      refLlmtNvl: form.rangeMin.trim() === '' ? null : Number(form.rangeMin),
      refUplmtNvl: form.rangeMax.trim() === '' ? null : Number(form.rangeMax),
      memoCn: form.memo.trim(),
    };
    if (isEdit) {
      updateInspection.mutate(
        { petSn, ckupRcdSn, inspNvlSn: item.inspNvlSn, ...value },
        { onSuccess: onClose },
      );
      return;
    }
    const values = [toInspectionValue(itemName, value)];
    createInspections.mutate(
      { petSn, ckupRcdSn, values },
      {
        onSuccess: (savedValues) => {
          const skippedNames = getSkippedNames([itemName], values, savedValues);
          if (skippedNames.length > 0) {
            showToast(`이미 등록된 항목입니다: ${skippedNames.join(', ')}`);
          }
          onClose();
        },
      },
    );
  };

  return (
    <FormModal
      title={isEdit ? '검사 수치 수정' : '검사 수치 추가'}
      isPending={isPending}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <LabItemForm
        form={form}
        errors={isSubmitted ? errors : {}}
        isEdit={isEdit}
        onChange={changeForm}
      />
    </FormModal>
  );
}
