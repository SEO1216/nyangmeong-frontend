import Modal from '@/components/Modal';
import { showToast } from '@/components/toastStore';
import { useCancelInvitation, useDeleteInvitation } from '../queries';

/**
 * [보낸 초대 취소·삭제 확인] (FN-MYP-005-03)
 * - 취소·삭제는 초대 단위라 그 초대에 묶인 반려동물 이름을 모두 적는다
 * - 오류는 서버 message를 토스트로 보이고 모달을 닫는다(목록은 훅이 다시 읽는다)
 */
const MODES = {
  cancel: {
    title: (target) => `${target}에게 보낸 초대를 취소할까요?`,
    description: '취소하면 받는 분은 이 초대를 수락하거나 거절할 수 없어요.',
    confirm: '초대 취소',
    keep: '취소하지 않음',
    done: '초대를 취소했어요',
  },
  delete: {
    title: (target) => `${target}에게 보낸 초대를 삭제할까요?`,
    description: '삭제하면 보낸 초대 목록에서 사라지고 되돌릴 수 없어요.',
    confirm: '삭제',
    keep: '닫기',
    done: '초대를 삭제했어요',
  },
};

export default function SentInvitationDialog({
  mode,
  invitation,
  petNames,
  onClose,
}) {
  const cancelInvitation = useCancelInvitation();
  const deleteInvitation = useDeleteInvitation();
  const mutation = mode === 'cancel' ? cancelInvitation : deleteInvitation;
  const text = MODES[mode];

  /** 요청 중에는 닫기 불가 */
  const close = () => {
    if (!mutation.isPending) onClose();
  };

  const handleConfirm = () =>
    mutation.mutate(invitation.jntBrupInvtnSn, {
      onSuccess: () => {
        onClose();
        showToast(text.done);
      },
      onError: (error) => {
        onClose();
        showToast(error.message);
      },
    });

  return (
    <Modal
      isConfirm
      isSpacious
      isPending={mutation.isPending}
      title={text.title(invitation.invtnTrgtEml)}
      description={`${petNames.join('·')} 초대예요. ${text.description}`}
      onClose={close}
      footer={
        <>
          <button
            type="button"
            onClick={close}
            disabled={mutation.isPending}
            className="h-11 min-w-0 flex-1 rounded-md border border-line bg-white font-semibold hover:border-line-strong hover:bg-surface-2"
          >
            {text.keep}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={mutation.isPending}
            className="h-11 min-w-0 flex-1 rounded-md bg-danger font-semibold text-white hover:bg-[#983a2f] disabled:bg-surface-3 disabled:text-line-strong"
          >
            {text.confirm}
          </button>
        </>
      }
    />
  );
}
