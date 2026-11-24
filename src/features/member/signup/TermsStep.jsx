import { Check, ChevronRight } from 'lucide-react';
import { AUTH_BTN_PRIMARY } from '../shared/authStyles';
import Checkbox from '@/components/Checkbox';
import AuthActions from '../shared/AuthActions';
import AuthBody from '../shared/AuthBody';
import { hasTermsView } from '../shared/validate';
import { SIGNUP_MESSAGES as MSG } from './signupMessages';

// 약관 목록과 모두 동의. 이메일 가입 1단계와 SNS 가입 확인 화면이 같이 쓴다.
// lockedSn은 외부에서 이미 확인된 항목(만 14세)이라 체크 대신 "확인 완료"로 보이고 모두 동의로 바뀌지 않는다
// isRoomy: 모바일에서 모두 동의 상자와 약관 줄 사이를 이메일 로그인처럼 넓힌다(가입 1단계, 추가-9)
export function TermsChecklist({ form, lockedSn, isRoomy = false }) {
  if (form.isTermsLoading) {
    return <p className="text-muted">{MSG.termsLoading}</p>;
  }
  if (form.isTermsError) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-danger">{MSG.termsFailed}</p>
        <button
          type="button"
          onClick={form.retryTerms}
          className={`${AUTH_BTN_PRIMARY} w-full`}
        >
          다시 시도
        </button>
      </div>
    );
  }
  return (
    <>
      <div
        className={`mb-2 flex min-h-[46px] items-center rounded-md border border-line px-4 font-semibold ${isRoomy ? 'max-[760px]:mb-3' : ''}`}
      >
        <Checkbox
          checked={form.isAllChecked}
          onChange={form.toggleAll}
          className="flex-1"
        >
          모두 동의
        </Checkbox>
      </div>
      {form.termsList.map(
        ({ trmsSn, trmsFixIdntfKey, trmsTtl, esntlAgreYn }) => {
          const label = (
            <span>
              <em
                className={`mr-1.5 font-semibold not-italic ${
                  esntlAgreYn ? 'text-brand-600' : 'text-subtle'
                }`}
              >
                {esntlAgreYn ? '[필수]' : '[선택]'}
              </em>
              {trmsTtl}
            </span>
          );
          return (
            <div
              key={trmsSn}
              className={`flex min-h-10 items-center px-4 text-ink-2 ${isRoomy ? 'max-[760px]:min-h-11' : ''}`}
            >
              {trmsSn === lockedSn ? (
                <div className="flex flex-1 items-center gap-3">
                  <span className="grid size-5 shrink-0 place-items-center rounded-xs border-[1.5px] border-brand-500 bg-brand-500">
                    <Check className="size-3.5 stroke-[3] text-white" />
                  </span>
                  {label}
                  <span className="ml-auto text-sm font-semibold text-brand-600">
                    확인 완료
                  </span>
                </div>
              ) : (
                <Checkbox
                  checked={Boolean(form.terms[trmsSn])}
                  onChange={() => form.toggleTerm(trmsSn)}
                  className="flex-1"
                >
                  {label}
                </Checkbox>
              )}
              {hasTermsView(trmsFixIdntfKey) && (
                <button
                  type="button"
                  onClick={() => form.openTerms(trmsSn)}
                  aria-label={`${trmsTtl} 내용보기`}
                  className="-mr-1 grid size-6 shrink-0 place-items-center text-subtle hover:text-ink max-[760px]:-mr-3.5 max-[760px]:size-11"
                >
                  <ChevronRight className="size-4" />
                </button>
              )}
            </div>
          );
        },
      )}
    </>
  );
}

// 1단계. 서버가 준 약관 중 필수 항목에 모두 동의해야 다음으로 간다. 선택(마케팅)은 진행 조건이 아니다
export default function TermsStep({ form }) {
  if (form.isTermsLoading || form.isTermsError) {
    return <TermsChecklist form={form} />;
  }
  return (
    <>
      <AuthBody>
        <TermsChecklist form={form} isRoomy />
        <p className="mt-2 text-sm leading-5 text-muted max-[760px]:mt-4">
          필수 약관에 모두 동의하면 다음으로 넘어갈 수 있습니다.
        </p>
      </AuthBody>
      <AuthActions>
        <button
          type="button"
          disabled={!form.isTermsOk}
          onClick={() => form.goStep('email')}
          className={`${AUTH_BTN_PRIMARY} w-full`}
        >
          다음
        </button>
      </AuthActions>
    </>
  );
}
