import { ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/Modal';
import {
  BTN_DANGER,
  BTN_PRIMARY,
  BTN_SECONDARY,
  TEXT_ACTION_DANGER,
} from '@/components/buttonStyles';
import { showToast } from '@/components/toastStore';
import { formatDate } from '@/utils/formatDate';
import CareChipPicker from './CareChipPicker';
import CareItemFields from './CareItemFields';
import { CareWarnBox } from './CareShortageNotice';
import SegmentSwitch from './SegmentSwitch';
import {
  EMPTY_CARE_FIELDS,
  MIN_CARE_COUNT,
  getCareCycleName,
  getCareErrorMessage,
  isCareFieldsValid,
  isLinkedCareItem,
  toCareCreateBody,
  toCareFields,
  toCareUpdateBody,
} from './careDue';
import { useSaveCareChanges } from './queries';
import { getCheckupDetailPath } from './summary/summaryUtils';

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

const MODE = { PICK: 'pick', EDIT: 'edit' };
const MODES = [
  { cd: MODE.PICK, nm: '고르기' },
  { cd: MODE.EDIT, nm: '수정' },
];
const EDIT_HINT = '고칠 항목을 눌러 주세요';

/**
 * [케어 항목 관리 모달] (※신규 정책)
 * - 왼쪽 맨 위 [고르기 | 수정] 전환(처음 고르기)
 *   - 고르기: 칩으로 켜고 끔(5개 이상), 오른쪽은 새 항목 만들기
 *   - 수정: 칩을 누르면 오른쪽에서 고침. 직접 만든 항목은 전체 칸 + [삭제하기], 기본 정기관리는 주기만, 연동 항목은 검진상세 이동 안내
 *   - 상태를 바꾸면 [수정 반영]한 내용은 남고 고치던 칸은 버림
 * - [삭제하기]: 확인창 뒤 칩만 빠지고 실제 삭제는 [저장하기] 때
 * - [저장하기]: 생성 -> 수정 -> 고른 항목 저장 -> 삭제. 실패하면 닫지 않고 남은 단계만 다시 시도
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
  const [mode, setMode] = useState(MODE.PICK);
  const [deletingItem, setDeletingItem] = useState(null);
  const [movingPath, setMovingPath] = useState(null);
  const navigate = useNavigate();
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
  const isEditMode = mode === MODE.EDIT;
  /** 기본 정기관리: 주기만 고침 */
  const isCycleOnly = editingItem?.bscArtclYn === true;

  /** 상태 전환: 반영하지 않은 입력칸은 버림 */
  const handleModeChange = (nextMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    resetPanel();
  };

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
    setDeletingItem(null);
  };

  /** 저장 안 한 변경: 칩 켜고 끄기·새 항목·[수정 반영]·삭제 */
  const isDirty =
    removedSns.length > 0 ||
    items.some(
      (item) =>
        item.careArtclSn == null ||
        item.fields != null ||
        item.isOn !== item.indctYn,
    );

  /** 검진상세로 이동: 저장 안 한 변경이 있으면 확인창 뒤 이동 (※신규 정책) */
  const handleMove = (path) => {
    if (isDirty) setMovingPath(path);
    else navigate(path);
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
          저장하기
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
      <div className="grid gap-6 px-6 py-5 min-[1100px]:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-4">
          {/** 더 고를 개수 = 5 − 지금 보이는 개수 (※신규 정책) */}
          {isForced && (
            <CareWarnBox>
              케어가 {shownCount}개로 줄었어요. {MIN_CARE_COUNT - shownCount}개
              이상 더 골라 주세요.
            </CareWarnBox>
          )}
          <SegmentSwitch
            options={MODES}
            selected={mode}
            className="w-full max-w-60"
            onSelect={handleModeChange}
          />
          <p className="text-muted">
            {petNm}에게 챙겨 줄 케어를 5개 이상 골라요.
          </p>
          <CareChipPicker
            items={items}
            isOn={(item) => item.isOn}
            isEditMode={isEditMode}
            editingKey={editingKey}
            onToggle={handleToggle}
            onEdit={handleEdit}
          />
        </div>

        {isEditMode && editingItem && isLinkedCareItem(editingItem) ? (
          <LinkedCarePanel
            petSn={petSn}
            item={editingItem}
            onMove={handleMove}
          />
        ) : isEditMode && !editingItem ? (
          <section
            aria-label="항목 수정"
            className="self-start rounded-[14px] border border-transparent bg-surface-2 p-4"
          >
            <p className="text-sm text-muted">{EDIT_HINT}</p>
          </section>
        ) : (
          <section
            aria-label={
              editingItem
                ? isCycleOnly
                  ? '주기 수정'
                  : '항목 수정'
                : '새 항목 만들기'
            }
            className={`flex flex-col gap-4 self-start rounded-[14px] border bg-surface-2 p-4 ${
              editingItem ? 'border-brand-500' : 'border-transparent'
            }`}
          >
            <div>
              <h3 className="font-bold break-keep text-ink">
                {editingItem
                  ? `${isCycleOnly ? '주기 수정' : '항목 수정'} · ${editingItem.careArtclNm}`
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
              isCycleOnly={isCycleOnly}
              lastCmptnYmd={editingItem?.lastCmptnYmd}
              nameRef={nameRef}
              onChange={changeFields}
            />
            {isCycleOnly && (
              <p className="text-sm text-muted">
                기본 항목은 주기만 바꿀 수 있어요
              </p>
            )}
            {editingItem ? (
              <>
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
                {!isCycleOnly && (
                  <button
                    type="button"
                    className={`${TEXT_ACTION_DANGER} self-center`}
                    onClick={() => setDeletingItem(editingItem)}
                  >
                    삭제하기
                  </button>
                )}
              </>
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
        )}
      </div>

      {/** 삭제 확인: [삭제하기]를 눌러도 칩만 빠지고 실제 DELETE는 [저장하기] 때 (※신규 정책) */}
      {deletingItem && (
        <Modal
          title={`${deletingItem.careArtclNm}을(를) 삭제할까요?`}
          description="완료 기록도 함께 사라져요. 모달 아래 [저장하기]를 눌러야 최종으로 삭제돼요."
          isConfirm
          onClose={() => setDeletingItem(null)}
          footer={
            <>
              <button
                type="button"
                className={BTN_SECONDARY}
                onClick={() => setDeletingItem(null)}
              >
                취소
              </button>
              <button
                type="button"
                className={BTN_DANGER}
                onClick={() => handleDelete(deletingItem)}
              >
                삭제하기
              </button>
            </>
          }
        />
      )}
      {movingPath && (
        <Modal
          title="저장하지 않고 이동할까요?"
          description="이 창에서 바꾼 내용은 저장되지 않아요"
          isConfirm
          onClose={() => setMovingPath(null)}
          footer={
            <>
              <button
                type="button"
                className={BTN_SECONDARY}
                onClick={() => setMovingPath(null)}
              >
                취소
              </button>
              <button
                type="button"
                className={BTN_PRIMARY}
                onClick={() => navigate(movingPath)}
              >
                이동하기
              </button>
            </>
          }
        />
      )}
    </Modal>
  );
}

const INFO_ROW = 'flex justify-between gap-3';

/**
 * [연동 항목 안내 칸] (※신규 정책)
 * - 「수정」 상태에서 처방약·반복 예방 칩을 누르면 오른쪽 칸 대신 보임
 * - 케어리스트에서는 고칠 수 없고, [검진상세에서 관리 ›]로 검진상세 그 탭(CareTile 이동 링크와 같은 규칙)에 감. ckupRcdSn이 없으면 버튼 숨김
 */
function LinkedCarePanel({ petSn, item, onMove }) {
  const isDose = item.prscSn != null;
  const rows = isDose
    ? [
        ['복용 종료일', item.mdcnEndYmd && formatDate(item.mdcnEndYmd)],
        ['1일 복용 횟수', item.dayMdcnNmtm != null && `${item.dayMdcnNmtm}회`],
      ]
    : [
        ['주기', getCareCycleName(item)],
        ['다음 예정일', item.nxtmPrnmntYmd && formatDate(item.nxtmPrnmntYmd)],
      ];

  return (
    <section
      aria-label="연동 항목"
      className="flex flex-col gap-4 self-start rounded-[14px] border border-brand-500 bg-surface-2 p-4"
    >
      <div>
        <h3 className="font-bold break-keep text-ink">
          연동 항목 · {item.careArtclNm}
        </h3>
        <p className="mt-1 text-sm break-keep text-muted">
          케어리스트에서는 수정·삭제할 수 없어요. 아래 버튼을 누르면 검진상세로
          이동해 관리할 수 있어요
        </p>
      </div>
      <dl className="flex flex-col gap-2 rounded-box bg-white p-4 text-sm tabular-nums">
        <div className={INFO_ROW}>
          <dt className="text-muted">연동</dt>
          <dd className="font-semibold text-ink">
            {isDose ? '처방약' : '반복 예방'}
          </dd>
        </div>
        {rows
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label} className={INFO_ROW}>
              <dt className="text-muted">{label}</dt>
              <dd className="font-semibold text-ink">{value}</dd>
            </div>
          ))}
      </dl>
      {item.ckupRcdSn != null && (
        <button
          type="button"
          className={`${BTN_PRIMARY} w-full gap-1`}
          onClick={() =>
            onMove(
              getCheckupDetailPath(
                { petSn, ckupRcdSn: item.ckupRcdSn },
                isDose ? 'prescription' : 'prevention',
              ),
            )
          }
        >
          검진상세에서 관리
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      )}
    </section>
  );
}
