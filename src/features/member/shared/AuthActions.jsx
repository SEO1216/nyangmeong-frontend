// 인증 화면의 주 버튼 묶음. 카드 맨 아래에 온다
// 바로 위 내용은 AuthBody(위아래 my-auto)나 flex-1 묶음이어야 이 묶음이 아래로 밀린다.
// 이 묶음을 감싸는 요소는 모두 flex-1 flex-col이어야 한다(AuthCard·StepMotion·form)
export default function AuthActions({ className = '', children }) {
  return <div className={`pt-6 ${className}`}>{children}</div>;
}
