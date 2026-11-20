// 인증 화면 제목. 세로 위치는 AuthCard·AuthBody가 정한다(제목+내용 묶음을 버튼 위 공간 가운데에)
export default function AuthHeading({ title, subtitle }) {
  return (
    <div className="mb-5 max-md:mb-9">
      <h2 className="mb-1.5 text-2xl font-bold tracking-[-0.02em] text-ink">
        {title}
      </h2>
      <p className="text-sm leading-normal text-subtle">{subtitle}</p>
    </div>
  );
}
