import Modal from '@/components/Modal';
import { useTerms } from '../queries';
import { TERMS_MESSAGES as MSG } from './termsMessages';
import { AUTH_BTN_SECONDARY } from './authStyles';

// 가입·복구 확인 화면에서 동의받는 약관의 전문을 서버에서 받아 보여 준다(자르지 않는다)
export default function TermsModal({ trmsSn, onClose }) {
  const terms = useTerms(trmsSn);

  return (
    <Modal
      title={terms.data?.trmsTtl ?? '약관'}
      onClose={onClose}
      footer={
        <button
          type="button"
          onClick={onClose}
          className={`${AUTH_BTN_SECONDARY} w-full`}
        >
          닫기
        </button>
      }
    >
      {terms.isPending && <p className="text-muted">{MSG.termsLoading}</p>}
      {terms.isError && <p className="text-danger">{terms.error.message}</p>}
      {terms.data && (
        <>
          <p className="mb-3 text-sm text-muted">버전 {terms.data.trmsVerId}</p>
          <div className="leading-6 whitespace-pre-wrap text-ink-2">
            {terms.data.trmsCn || MSG.termsEmpty}
          </div>
        </>
      )}
    </Modal>
  );
}
