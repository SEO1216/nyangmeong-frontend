// 인증 화면에서 제목 아래 내용 묶음. 남는 칸을 AuthCard의 위 빈칸과 반씩 나눠 가져서
// 제목+내용 묶음이 아래 버튼(AuthActions) 위 공간의 가운데에 온다. 내용이 길면 빈칸 없이 이어진다
export default function AuthBody({ className = '', children }) {
  return <div className={`flex grow flex-col ${className}`}>{children}</div>;
}
