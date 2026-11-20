import { Mail } from 'lucide-react';
import { AUTH_BTN_PRIMARY } from '../shared/authStyles';
import AuthActions from '../shared/AuthActions';
import AuthBody from '../shared/AuthBody';
import AuthCard from '../shared/AuthCard';
import AuthHeading from '../shared/AuthHeading';
import AuthNotice from '../shared/AuthNotice';
import { LOGIN_MESSAGES as MSG } from './loginMessages';
import SnsLoginButtons from './SnsLoginButtons';

export default function LoginMethodChoice({
  onBack,
  onSelectEmail,
  onSignup,
  isJoined,
  snsNotice,
  isSnsPending,
}) {
  return (
    <AuthCard onBack={onBack} spacing="center">
      <AuthHeading title="로그인" subtitle="가입한 방법으로 로그인해 주세요." />
      {/* 모바일은 초록 버튼을 다른 화면 주 버튼처럼 맨 아래에 두고,
          PC는 SNS·이메일 버튼을 한 묶음으로 가운데에 둔다(버튼 묶음 아래 칸이 남는 칸을 가져감) */}
      <AuthBody className="min-[760px]:grow-0">
        {isJoined && (
          <AuthNotice
            type="ok"
            message="회원가입이 완료되었습니다. 가입한 방법으로 로그인해 주세요."
          />
        )}
        {isSnsPending && <AuthNotice type="info" message={MSG.snsPending} />}
        {snsNotice && (
          <AuthNotice type={snsNotice.type} message={snsNotice.message} />
        )}
        <SnsLoginButtons disabled={isSnsPending} />
      </AuthBody>
      <AuthActions className="min-[760px]:grow">
        <div className="mb-6 flex items-center gap-4 text-subtle before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
          또는
        </div>
        <button
          type="button"
          onClick={onSelectEmail}
          className={`${AUTH_BTN_PRIMARY} w-full`}
        >
          <Mail className="size-5" />
          이메일로 로그인하기
        </button>
      </AuthActions>
      <div className="mt-6 flex justify-center gap-2 text-muted">
        아직 회원이 아니신가요?
        <button
          type="button"
          onClick={onSignup}
          className="font-semibold text-brand-600 hover:underline hover:underline-offset-[3px]"
        >
          회원가입
        </button>
      </div>
    </AuthCard>
  );
}
