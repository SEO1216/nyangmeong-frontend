import { Mail, ShieldCheck } from 'lucide-react';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import AuthField from '../shared/AuthField';
import AuthNotice from '../shared/AuthNotice';
import { resendLabel } from '../shared/emailCert';
import { SIGNUP_MESSAGES as MSG } from './signupMessages';

export default function EmailStep({ form }) {
  return (
    <>
      <div className="flex flex-col gap-5">
        <AuthField
          id="signup-email"
          icon={Mail}
          label="이메일 (로그인 아이디)"
          value={form.email}
          onChange={form.changeEmail}
          placeholder="이메일 주소 입력"
          autoComplete="username"
          inputMode="email"
          error={form.errors.email}
          action={
            <button
              type="button"
              onClick={form.submitSend}
              disabled={
                !form.email.trim() || form.isSending || form.resendSeconds > 0
              }
              className={`${BTN_SECONDARY} min-w-22 shrink-0 whitespace-nowrap`}
            >
              {form.isSent
                ? resendLabel(form.resendSeconds)
                : '인증번호 보내기'}
            </button>
          }
        />
        {form.errors.email === MSG.emailDuplicate && (
          <button
            type="button"
            onClick={form.goLoginMethods}
            className={`${BTN_SECONDARY} w-full`}
          >
            기존 가입 방법으로 로그인
          </button>
        )}
        {/** 오답 안내: 이메일 칸 바로 아래 */}
        {form.isCodeLocked && form.notice && (
          <AuthNotice
            type={form.notice.type}
            message={form.notice.message}
          />
        )}
        {form.isSent && !form.isCodeLocked && (
          <AuthField
            id="signup-code"
            icon={ShieldCheck}
            label="인증번호"
            value={form.code}
            onChange={form.changeCode}
            placeholder="숫자 6자리 입력"
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={6}
            readOnly={form.isEmailVerified}
            error={form.errors.code}
            success={form.isEmailVerified ? MSG.verified : ''}
            help={
              <>
                {MSG.sent}
                <br />
                {MSG.spamHint}
              </>
            }
            endAdornment={
              !form.isEmailVerified && (
                <span className="font-semibold text-danger tabular-nums">
                  {form.countdown.text}
                </span>
              )
            }
            action={
              <button
                type="button"
                onClick={form.submitVerify}
                disabled={
                  !form.code || form.isVerifying || form.isEmailVerified
                }
                className={`${BTN_SECONDARY} min-w-22 shrink-0 whitespace-nowrap !border-transparent !bg-brand-50 !text-brand-600 hover:enabled:!bg-brand-100 disabled:!bg-surface-3 disabled:!text-line-strong`}
              >
                인증 확인
              </button>
            }
          />
        )}
      </div>
      <p className="mt-3 text-sm leading-5 text-muted">
        {form.isEmailVerified
          ? '다음을 눌러 휴대전화번호를 입력해 주세요.'
          : '이메일 인증이 완료되면 다음으로 넘어갈 수 있습니다.'}
      </p>
      <button
        type="button"
        disabled={!form.isEmailVerified}
        onClick={() => form.goStep('phone')}
        className={`${BTN_PRIMARY} w-full mt-8`}
      >
        다음
      </button>
    </>
  );
}
