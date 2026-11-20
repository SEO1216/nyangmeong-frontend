import { Check, Lock } from 'lucide-react';
import AuthActions from '../shared/AuthActions';
import AuthBody from '../shared/AuthBody';
import AuthCard from '../shared/AuthCard';
import AuthField from '../shared/AuthField';
import AuthHeading from '../shared/AuthHeading';
import AuthNotice from '../shared/AuthNotice';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import { TEXT_LINK } from '../shared/authStyles';
import { PASSWORD_MESSAGES as MSG } from './passwordMessages';
import usePasswordReset from './usePasswordReset';

export default function PasswordResetForm({
  isVerified,
  grant,
  onGoLogin,
  onRetryAuth,
}) {
  const form = usePasswordReset(grant);

  if (form.isDone) {
    return (
      <AuthCard isCentered={false}>
        {/* 완료 화면은 회원가입·복구 완료와 같이 체크·제목 묶음을 가운데에 */}
        <div className="flex flex-1 flex-col justify-center text-center">
          <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-tone-green-bg text-tone-green-fg">
            <Check className="size-8" />
          </div>
          <AuthHeading
            title="비밀번호가 변경되었습니다"
            subtitle="새 비밀번호로 다시 로그인해 주세요."
          />
        </div>
        <AuthActions>
          <button
            type="button"
            onClick={onGoLogin}
            className={`${BTN_PRIMARY} w-full`}
          >
            로그인으로
          </button>
        </AuthActions>
      </AuthCard>
    );
  }

  if (!isVerified || form.isExpired) {
    return (
      <AuthCard>
        <AuthHeading
          title="비밀번호 재설정"
          subtitle="본인확인을 다시 하면 비밀번호를 바꿀 수 있습니다."
        />
        <AuthBody>
          <AuthNotice type="error" message={MSG.needVerify} />
        </AuthBody>
        <AuthActions className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onRetryAuth}
            className={`${BTN_PRIMARY} w-full`}
          >
            이메일 인증 다시 하기
          </button>
          <button
            type="button"
            onClick={onGoLogin}
            className={`${BTN_SECONDARY} w-full`}
          >
            로그인으로
          </button>
        </AuthActions>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthHeading
        title="비밀번호 재설정"
        subtitle={
          <>
            본인확인이 완료되었습니다.
            <br />새 비밀번호를 입력해 주세요.
          </>
        }
      />
      {form.notice && (
        <AuthNotice type={form.notice.type} message={form.notice.message} />
      )}
      <form noValidate onSubmit={form.submit} className="flex grow flex-col">
        <AuthBody className="gap-5">
          <AuthField
            id="reset-password"
            icon={Lock}
            label="새 비밀번호"
            type="password"
            value={form.password}
            onChange={form.changePassword}
            placeholder="비밀번호 입력"
            autoComplete="new-password"
            error={form.passwordError}
            help={MSG.pwHelp}
          />
          <AuthField
            id="reset-confirm"
            icon={Lock}
            label="새 비밀번호 확인"
            type="password"
            value={form.confirm}
            onChange={form.changeConfirm}
            onBlur={form.blurConfirm}
            placeholder="비밀번호 다시 입력"
            autoComplete="new-password"
            error={form.confirmError}
            success={form.confirmSuccess}
          />
        </AuthBody>
        <AuthActions>
          <button
            type="submit"
            disabled={!form.canSubmit || form.isPending}
            className={`${BTN_PRIMARY} w-full`}
          >
            비밀번호 재설정
          </button>
        </AuthActions>
      </form>
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => form.cancel(onGoLogin)}
          className={TEXT_LINK}
        >
          취소
        </button>
      </div>
    </AuthCard>
  );
}
