import { useState } from 'react';
import CareItemFields from './CareItemFields';
import { isCareFieldsValid, toCareFields, toCareUpdateBody } from './careDue';
import FormModal from './diary/FormModal';
import { useUpdateCareItem } from './queries';

/**
 * [관리 항목 수정 모달] (FN-HLT-003-21~24)
 * - 케어리스트 줄의 ⋮ [수정]에서 열림. 새 항목은 「케어 항목 관리」 모달에서 만듦 (※신규 정책)
 * - 기본 정기관리 항목은 주기만 수정
 */
export default function CareItemModal({ petSn, item, onClose }) {
  const [fields, setFields] = useState(() => toCareFields(item));
  const updateCareItem = useUpdateCareItem();
  const canSubmit = isCareFieldsValid(fields) && !updateCareItem.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    updateCareItem.mutate(
      {
        petSn,
        careArtclSn: item.careArtclSn,
        body: toCareUpdateBody(fields, item),
      },
      { onSuccess: onClose },
    );
  };

  return (
    <FormModal
      icon="playlist_add"
      title="관리 항목 수정"
      submitLabel="수정하기"
      widthClassName="w-[min(440px,calc(100%-32px))]"
      isSubmitDisabled={!canSubmit}
      isPending={updateCareItem.isPending}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <CareItemFields
        fields={fields}
        isBasic={item.bscArtclYn}
        isEdit
        lastCmptnYmd={item.lastCmptnYmd}
        onChange={(patch) => setFields((prev) => ({ ...prev, ...patch }))}
      />
      {updateCareItem.isError && (
        <p role="alert" className="text-sm text-[#b4473a]">
          {updateCareItem.error.message}
        </p>
      )}
    </FormModal>
  );
}
