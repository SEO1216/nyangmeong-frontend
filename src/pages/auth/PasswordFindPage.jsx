import { useNavigate } from 'react-router-dom';
import PasswordFindForm from '@/features/member/password/PasswordFindForm';
import { PATHS } from '@/routes/paths';

export default function PasswordFindPage() {
  const navigate = useNavigate();

  return (
    <PasswordFindForm
      onVerified={(state) => navigate(PATHS.PASSWORD_RESET, { state })}
      // [로그인으로]는 로그인 첫 화면(방법 선택)으로 가고, 비밀번호 찾기를 기록에서 바꿔 뒤로가기가 이 화면으로 돌아오지 않게 한다
      onBackToLogin={() => navigate(PATHS.LOGIN, { replace: true })}
      onGoLogin={() => navigate(PATHS.LOGIN)}
      onRecover={(recoveryEmail) =>
        navigate(PATHS.SIGNUP, { state: { recoveryEmail } })
      }
    />
  );
}
