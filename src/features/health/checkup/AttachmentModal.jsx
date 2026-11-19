import { useState } from 'react';
import FieldError, { Required } from '@/components/FieldError';
import { INPUT, LABEL } from '@/components/formStyles';
import FormModal from '../diary/FormModal';
import { useCreateAttachment } from '../queries';
import SegmentSwitch from '../SegmentSwitch';
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENT_IMAGE,
  ATTACHMENT_TYPES,
  IMAGING_KINDS,
  IMAGING_PARTS,
} from './checkupTypes';
import { getFileError } from './attachmentUtils';

const REQUIRED = <Required />;

/**
 * [첨부 추가 모달]
 * - 파일 유형·파일, "영상 사진"이면 영상 종류·촬영 부위 둘 다 필수 (FN-HLT-005-01)
 * - initialType: 처음 골라 둘 파일 유형(영상검사의 [첨부 자료 추가하기]는 영상 사진)
 */
export default function AttachmentModal({
  petSn,
  ckupRcdSn,
  initialType = '',
  onClose,
}) {
  const [atchTypeCd, setAtchTypeCd] = useState(initialType);
  const [file, setFile] = useState(null);
  const [imgKindCd, setImgKindCd] = useState('');
  const [imgPartCd, setImgPartCd] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createAttachment = useCreateAttachment();
  const isImage = atchTypeCd === ATTACHMENT_IMAGE;

  const errors = {
    type: atchTypeCd === '',
    file: getFileError(file),
    kind: isImage && imgKindCd === '',
    part: isImage && imgPartCd === '',
  };
  const isInvalid = (field) => isSubmitted && errors[field];

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    createAttachment.mutate(
      {
        petSn,
        ckupRcdSn,
        atchTypeCd,
        file,
        imgKndCd: imgKindCd,
        shtRegnCd: imgPartCd,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <FormModal
      title="첨부 추가"
      isPending={createAttachment.isPending}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      {/** 반복 예방 모달과 같은 한 줄 버튼. 처음에는 아무것도 고르지 않음(영상검사에서 열면 영상 사진) */}
      <fieldset className="flex flex-col gap-1.5">
        <legend className={`${LABEL} mb-1.5`}>파일 유형{REQUIRED}</legend>
        <SegmentSwitch
          options={ATTACHMENT_TYPES}
          selected={atchTypeCd}
          onSelect={setAtchTypeCd}
        />
        {isInvalid('type') && (
          <FieldError>파일 유형을 선택해 주세요</FieldError>
        )}
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL}>파일{REQUIRED}</span>
        <input
          type="file"
          accept={ATTACHMENT_ACCEPT}
          aria-invalid={isInvalid('file') ? true : undefined}
          className={`${INPUT} pt-2`}
          onChange={(event) => setFile(event.target.files[0] ?? null)}
        />
        <p className="text-sm text-muted">
          jpg·jpeg·png·webp·pdf · 1건 10MB 이하
        </p>
        {isInvalid('file') && <FieldError>{errors.file}</FieldError>}
      </label>

      {isImage && (
        <>
          <fieldset className="flex flex-col gap-1.5">
            <legend className={`${LABEL} mb-1.5`}>영상 종류{REQUIRED}</legend>
            <SegmentSwitch
              options={IMAGING_KINDS}
              selected={imgKindCd}
              onSelect={setImgKindCd}
            />
            {isInvalid('kind') && (
              <FieldError>영상 종류를 선택해 주세요</FieldError>
            )}
          </fieldset>
          <fieldset className="flex flex-col gap-1.5">
            <legend className={`${LABEL} mb-1.5`}>촬영 부위{REQUIRED}</legend>
            <SegmentSwitch
              options={IMAGING_PARTS}
              selected={imgPartCd}
              onSelect={setImgPartCd}
            />
            {isInvalid('part') && (
              <FieldError>촬영 부위를 선택해 주세요</FieldError>
            )}
          </fieldset>
        </>
      )}
    </FormModal>
  );
}
