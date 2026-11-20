import { Phone } from 'lucide-react';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import { normalizePhone } from '../shared/validate';
import AuthField from '../shared/AuthField';
import SignupSummary from './SignupSummary';
import { SIGNUP_MESSAGES as MSG } from './signupMessages';

export default function PhoneStep({ form }) {
  return (
    <>
      <div className="flex flex-col gap-4 max-[760px]:gap-5">
        <AuthField
          id="signup-phone"
          icon={Phone}
          label="휴대전화번호"
          value={form.phone}
          onChange={form.changePhone}
          placeholder="01012345678"
          autoComplete="tel"
          inputMode="tel"
          error={form.errors.phone}
          success={form.isPhoneChecked ? MSG.phoneAvailable : ''}
          help={normalizePhone(form.phone) ? MSG.phoneNeedCheck : ''}
          action={
            <button
              type="button"
              onClick={form.submitPhoneCheck}
              disabled={!normalizePhone(form.phone) || form.isPhoneChecking}
              className={`${BTN_SECONDARY} min-w-22 shrink-0 whitespace-nowrap`}
            >
              중복확인
            </button>
          }
        />
        <SignupSummary rows={[['이메일 · 인증 완료', form.email]]} />
      </div>
      <button
        type="button"
        disabled={!form.isPhoneChecked}
        onClick={() => form.goStep('password')}
        className={`${BTN_PRIMARY} w-full mt-5 max-[760px]:mt-8`}
      >
        다음
      </button>
    </>
  );
}
