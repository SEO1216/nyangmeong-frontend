import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '@/components/ConfirmModal';

const COPY = {
  write: {
    title: '작성을 그만둘까요?',
    description: '지금까지 쓴 내용은 저장되지 않아요.',
    cancelLabel: '계속 쓰기',
  },
  edit: {
    title: '수정을 그만둘까요?',
    description: '고친 내용은 저장되지 않고 원래 글이 그대로 남아요.',
    cancelLabel: '계속 수정',
  },
};

/**
 * 글쓰기·글수정에서 나갈 때 확인(공용 「목록으로」·[취소] 확인 창)
 * - 고친 여부: isDirty를 넘기면 그 값을, 안 넘기면 폼이 setDirty로 알린 값을 쓴다
 * - onLeave(to): 고친 게 있을 때만 확인 창, 없으면 바로 이동. 틀의 사이드 메뉴·경로 이동에도 같이 쓴다
 * - mode: 'write'(작성) | 'edit'(수정). 문구만 다르다
 */
export default function useLeaveGuard({ isDirty: dirtyProp, mode = 'write' } = {}) {
  const navigate = useNavigate();
  const [dirtyState, setDirty] = useState(false);
  const [leaveTo, setLeaveTo] = useState(null);
  const isDirty = dirtyProp ?? dirtyState;
  const copy = COPY[mode] ?? COPY.write;

  const onLeave = useCallback(
    (to) => {
      if (isDirty) setLeaveTo(to);
      else navigate(to);
    },
    [isDirty, navigate],
  );

  const leaveModal = leaveTo && (
    <ConfirmModal
      title={copy.title}
      description={copy.description}
      confirmLabel="나가기"
      cancelLabel={copy.cancelLabel}
      onConfirm={() => navigate(leaveTo)}
      onCancel={() => setLeaveTo(null)}
    />
  );

  return { setDirty, onLeave, leaveModal };
}
