import { useRef, useState } from 'react';
import Modal from '@/components/Modal';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import { showToast } from '@/components/toastStore';
import CareChipPicker from './CareChipPicker';
import CareItemFields from './CareItemFields';
import { CareWarnBox } from './CareShortageNotice';
import {
  EMPTY_CARE_FIELDS,
  MIN_CARE_COUNT,
  getCareErrorMessage,
  isCareFieldsValid,
  isLinkedCareItem,
  toCareCreateBody,
  toCareFields,
  toCareUpdateBody,
} from './careDue';
import { useSaveCareChanges } from './queries';

/** 입력칸 값 -> 칩에 그릴 값 */
const toChipValues = (fields) => {
  const body = toCareCreateBody(fields);
  return {
    careArtclNm: body.careArtclNm,
    rprsIconId: body.rprsIconId,
    careZoneCd: body.careZoneCd,
    careCycleCd: body.careCycleCd,
    cycleDrctInptDayCnt: body.cycleDrctInptDayCnt,
  };
};

/**
 * [케어 항목 관리 모달] (※신규 정책)
 * - 왼쪽: 전체 항목 칩 고르기(5개 이상), 오른쪽: 새 항목 만들기·직접 만든 항목 수정
 * - [저장]: 생성 -> 수정 -> 고른 항목 저장 -> 삭제. 실패하면 닫지 않고 남은 단계만 다시 시도
 * - isForced: 보이는 항목이 5개 미만이라 자동으로 열린 상태 -> 5개를 맞춰 저장해야 닫힘
 */
export default function CareManageModal({
  petSn,
  petNm,
  careItems,
  isForced = false,
  onClose,
}) {
  /** 화면에서 고치는 초안: 서버 항목 + chipKey·isOn·fields(고친 입력값) */
  const [items, setItems] = useState(() =>
    careItems.map((item) => ({
      ...item,
      chipKey: item.careArtclSn,
      isOn: item.indctYn,
      fields: null,
    })),
  );
  const [removedSns, setRemovedSns] = useState([]);
  const [fields, setFields] = useState(EMPTY_CARE_FIELDS);
  const [editingKey, setEditingKey] = useState(null);
  const nameRef = useRef(null);
  const newCountRef = useRef(0);
  /** 끝난 저장 단계: 다시 시도할 때 새 항목이 두 번 생기지 않게 보관 */
  const doneRef = useRef({
    createdSns: {},
    updatedBodies: {},
    indicationKey: null,
    deletedSns: [],
  });
  const saveChanges = useSaveCareChanges();

  const shownCount = careItems.filter((item) => item.indctYn).length;
  const isItemOn = (item) => isLinkedCareItem(item) || item.isOn;
  const pickedCount = items.filter(isItemOn).length;
  const isShort = pickedCount < MIN_CARE_COUNT;
  const editingItem = items.find((item) => item.chipKey === editingKey);
  const canApply = isCareFieldsValid(fields);

  const changeFields = (patch) => setFields((prev) => ({ ...prev, ...patch }));

  /** 입력칸 비우기: 반복 유형은 방금 고른 값 유지 */
  const resetPanel = (careZoneCd = null) => {
    setEditingKey(null);
    setFields({ ...EMPTY_CARE_FIELDS, careZoneCd });
  };

  const handleToggle = (target) =>
    setItems((prev) =>
      prev.map((item) =>
        item.chipKey === target.chipKey ? { ...item, isOn: !item.isOn } : item,
      ),
    );

  const handleAdd = () => {
    if (!canApply) return;
    newCountRef.current += 1;
    setItems((prev) => [
      ...prev,
      {
        ...toChipValues(fields),
        chipKey: `new-${newCountRef.current}`,
        careArtclSn: null,
        bscArtclYn: false,
        prscSn: null,
        reptPrvntMngSn: null,
        isOn: true,
        fields,
      },
    ]);
    resetPanel(fields.careZoneCd);
    nameRef.current?.focus();
  };

  const handleEdit = (target) => {
    setEditingKey(target.chipKey);
    setFields(target.fields ?? toCareFields(target));
  };

  const handleApplyEdit = () => {
    if (!canApply) return;
    setItems((prev) =>
      prev.map((item) =>
        item.chipKey === editingKey
          ? { ...item, ...toChipValues(fields), fields }
          : item,
      ),
    );
    resetPanel();
  };

  const handleDelete = (target) => {
    const careArtclSn =
      target.careArtclSn ?? doneRef.current.createdSns[target.chipKey];
    if (careArtclSn != null) setRemovedSns((prev) => [...prev, careArtclSn]);
    setItems((prev) => prev.filter((item) => item.chipKey !== target.chipKey));
    if (editingKey === target.chipKey) resetPanel();
  };

  const handleSave = () => {
    if (isShort || saveChanges.isPending) return;
    saveChanges.mutate(
      {
        petSn,
        removedSns,
        done: doneRef.current,
        items: items.map((item) => {
          const original = careItems.find(
            (careItem) => careItem.careArtclSn === item.careArtclSn,
          );
          return {
            chipKey: item.chipKey,
            careArtclSn: item.careArtclSn,
            isOn: isItemOn(item),
            createBody: original ? null : toCareCreateBody(item.fields),
            updateBody:
              original && item.fields
                ? toCareUpdateBody(item.fields, original)
                : null,
          };
        }),
      },
      {
        onSuccess: () => {
          showToast('케어 항목을 저장했어요');
          onClose();
        },
      },
    );
  };

  const footer = (
    <>
      <p className="mr-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        {saveChanges.isError && (
          <span role="alert" className="font-semibold text-danger">
            {getCareErrorMessage(saveChanges.error)}{' '}
            <button type="button" className="underline" onClick={handleSave}>
              다시 시도
            </button>
          </span>
        )}
        {isShort && (
          <span role="alert" className="font-semibold text-danger">
            5개 이상 골라 주세요
          </span>
        )}
        <span className="text-muted">
          <b className="text-ink">{pickedCount}개</b> 골랐어요
        </span>
      </p>
      <div className="flex gap-2">
        {!isForced && (
          <button
            type="button"
            className={`${BTN_SECONDARY} min-w-20`}
            disabled={saveChanges.isPending}
            onClick={onClose}
          >
            취소
          </button>
        )}
        <button
          type="button"
          className={`${BTN_PRIMARY} min-w-20`}
          disabled={isShort || saveChanges.isPending}
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </>
  );

  return (
    <Modal
      title="케어 항목 관리"
      footer={footer}
      isLarge
      isAutoHeight
      width={1040}
      isCloseIconHidden={isForced}
      isDismissDisabled={isForced}
      isPending={saveChanges.isPending}
      onClose={onClose}
    >
      <div className="grid gap-6 px-6 py-5 min-[901px]:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-4">
          {/** 더 고를 개수 = 5 − 지금 보이는 개수 (※신규 정책) */}
          {isForced && (
            <CareWarnBox>
              케어가 {shownCount}개로 줄었어요. {MIN_CARE_COUNT - shownCount}개
              이상 더 골라 주세요.
            </CareWarnBox>
          )}
          <p className="text-muted">
            {petNm}에게 챙겨 줄 케어를 5개 이상 골라요.
          </p>
          <CareChipPicker
            items={items}
            isOn={(item) => item.isOn}
            editingKey={editingKey}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <section
          aria-label={editingItem ? '항목 수정' : '새 항목 만들기'}
          className={`flex flex-col gap-4 self-start rounded-[14px] border bg-surface-2 p-4 ${
            editingItem ? 'border-brand-500' : 'border-transparent'
          }`}
        >
          <div>
            <h3 className="font-bold break-keep text-ink">
              {editingItem
                ? `항목 수정 · ${editingItem.careArtclNm}`
                : '새 항목 만들기'}
            </h3>
            {!editingItem && (
              <p className="mt-1 text-sm text-muted">
                만든 항목은 켜진 상태로 왼쪽에 추가돼요
              </p>
            )}
          </div>
          <CareItemFields
            fields={fields}
            isEdit={editingItem?.careArtclSn != null}
            lastCmptnYmd={editingItem?.lastCmptnYmd}
            nameRef={nameRef}
            onChange={changeFields}
          />
          {editingItem ? (
            <div className="flex gap-2">
              <button
                type="button"
                className={`${BTN_SECONDARY} flex-1`}
                onClick={() => resetPanel()}
              >
                수정 취소
              </button>
              <button
                type="button"
                className={`${BTN_PRIMARY} flex-1`}
                disabled={!canApply}
                onClick={handleApplyEdit}
              >
                수정 반영
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={`${BTN_PRIMARY} w-full`}
              disabled={!canApply}
              onClick={handleAdd}
            >
              추가
            </button>
          )}
        </section>
      </div>
    </Modal>
  );
}
