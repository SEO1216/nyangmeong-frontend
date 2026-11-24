import { CircleHelp } from 'lucide-react';

/**
 * [서비스 튜토리얼 다시 보기 버튼] (SCR-MAN-001) 메인 왼쪽 아래 고정
 * - 상자 없이 아이콘만(사람 요청 2026-11-20). 아이콘 24px + 여백 10px로 누르는 영역 44px, 아이콘은 왼쪽·아래 24px 자리
 * - 화면 맨 아래에서 24px 위, 맨 아래 픽셀 띠 위에 겹쳐 얹는다(사람 요청 2026-11-20). 메인에는 바텀 네비가 없다
 */
export default function TutorialReplayButton({ onClick }) {
  return (
    <button
      type="button"
      className="fixed bottom-[14px] left-[14px] z-30 flex items-center justify-center p-2.5 text-ink-2 hover:text-ink"
      aria-label="서비스 둘러보기"
      title="서비스 둘러보기"
      onClick={onClick}
    >
      <CircleHelp className="size-6" aria-hidden="true" />
    </button>
  );
}
