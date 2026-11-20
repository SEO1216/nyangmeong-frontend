import { ChevronLeft } from 'lucide-react';

// 제목 위 빈칸. PC는 AuthBody와 남는 칸을 반씩 나눠 제목+내용 묶음을 가운데에 둔다.
// 모바일은 화면 높이 비율로 고정해서, 인증번호 칸·안내처럼 내용이 늘어도 제목이 움직이지 않고 아래로만 늘어난다.
// 내용이 적은 화면(spacing="sparse")과 로그인 방법 선택("center")은 더 내려서(16%) 가운데 쪽에, 나머지는 위쪽(6%)
const SPACER = {
  normal: 'grow max-md:h-[6dvh] max-md:grow-0',
  sparse: 'grow max-md:h-[16dvh] max-md:grow-0',
  center: 'grow max-md:h-[16dvh] max-md:grow-0',
};

// 인증 화면 카드. 칸 높이를 채워서 AuthActions(주 버튼 묶음)가 모든 화면에서 맨 아래에 오게 한다.
// 완료 화면은 자기 묶음을 직접 가운데에 두므로 isCentered={false}
export default function AuthCard({
  onBack,
  isCentered = true,
  spacing = 'normal',
  className = '',
  children,
}) {
  return (
    <section className={`relative flex w-full flex-1 flex-col ${className}`}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="-ml-2 mb-1 grid size-9 shrink-0 place-items-center self-start rounded-full text-ink-2 hover:bg-surface-2"
        >
          <ChevronLeft className="size-6" />
        </button>
      )}
      {isCentered && <div aria-hidden="true" className={SPACER[spacing]} />}
      {children}
    </section>
  );
}
