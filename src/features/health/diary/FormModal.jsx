import { useId } from 'react';
import Modal from '@/components/Modal';
import { Required } from '@/components/FieldError';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';

/**
 * [건강 일지 입력 모달] 공용 Modal(isLarge·isAutoHeight) 위에 폼과 하단 줄을 얹는다(UI 체크리스트 58)
 * - 본문은 안쪽 스크롤, 760px 이하는 화면 전체
 * - ESC·✕·배경·취소로 닫음. 저장 중에는 닫지 않음
 * - cancelLabel·onCancel: 왼쪽 버튼을 닫기가 아닌 다른 일(예: 다시 촬영하기)로 바꿀 때
 * - hasRequiredNote: 하단 왼쪽 "* 표시는 필수 항목이에요", isSubmitDisabled: 저장 비활성
 * - width: 가로 폭(px) 560·720, null이면 760
 */
export default function FormModal({
  title,
  submitLabel = '저장하기',
  cancelLabel = '취소',
  isPending = false,
  isSubmitDisabled = false,
  hasRequiredNote = true,
  hasFooter = true,
  width = 720,
  onSubmit,
  onCancel,
  onClose,
  children,
}) {
  const formId = useId();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isPending && !isSubmitDisabled) onSubmit();
  };

  return (
    <Modal
      title={title}
      isLarge
      isAutoHeight
      width={width}
      isPending={isPending}
      onClose={onClose}
      footer={
        hasFooter && (
          <>
            {hasRequiredNote ? (
              <p className="text-muted">
                <Required /> 표시는 필수 항목이에요
              </p>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isPending}
                className={`${BTN_SECONDARY} min-w-24`}
                onClick={onCancel ?? onClose}
              >
                {cancelLabel}
              </button>
              <button
                type="submit"
                form={formId}
                disabled={isPending || isSubmitDisabled}
                className={`${BTN_PRIMARY} min-w-24`}
              >
                {submitLabel}
              </button>
            </div>
          </>
        )
      }
    >
      <form
        id={formId}
        noValidate
        className="flex flex-col gap-5 px-6 py-5"
        onSubmit={handleSubmit}
      >
        {children}
      </form>
    </Modal>
  );
}
