import { Phone } from 'lucide-react';
import { SIDE_BTN, AUTH_BTN_PRIMARY } from '../shared/authStyles';
import { normalizePhone } from '../shared/validate';
import AuthActions from '../shared/AuthActions';
import AuthBody from '../shared/AuthBody';
import AuthField from '../shared/AuthField';
import SignupSummary from './SignupSummary';
import { SIGNUP_MESSAGES as MSG } from './signupMessages';

export default function PhoneStep({ form }) {
  return (
    <>
      <AuthBody className="max-[760px]:pt-8">
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
                className={SIDE_BTN}
              >
                중복확인
              </button>
            }
          />
          <SignupSummary rows={[['이메일 · 인증 완료', form.email]]} />
        </div>
      </AuthBody>
      <AuthActions>
        <button
          type="button"
          disabled={!form.isPhoneChecked}
          onClick={() => form.goStep('password')}
          className={`${AUTH_BTN_PRIMARY} w-full`}
        >
          다음
        </button>
      </AuthActions>
    </>
  );
}
