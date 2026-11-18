import Modal from './Modal';
import { BTN_PRIMARY, BTN_SECONDARY } from './buttonStyles';

/**
 * 확인 창. 공용 Modal의 isConfirm(440px, 가운데 정렬, 버튼 꽉 참)으로 그린다.
 * 버튼 순서는 [취소][확인], 처음 포커스는 안전한 [취소]. ESC·배경 클릭은 onCancel, 처리 중에는 닫지 않는다
 */
export default function ConfirmModal({
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  errorMessage,
  isPending = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      isConfirm
      title={title}
      description={description}
      isPending={isPending}
      onClose={onCancel}
      footer={
        <>
          <button
            type="button"
            autoFocus
            disabled={isPending}
            className={BTN_SECONDARY}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isPending}
            className={BTN_PRIMARY}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      {errorMessage && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {errorMessage}
        </p>
      )}
    </Modal>
  );
}
