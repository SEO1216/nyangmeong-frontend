import { CircleAlert, CircleCheck } from 'lucide-react';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { getToasts, subscribe } from './toastStore';

const TYPE_STYLE = {
  info: { box: 'bg-gray-900', Icon: null },
  success: { box: 'bg-gray-900', Icon: CircleCheck },
  error: { box: 'bg-danger', Icon: CircleAlert },
};

/**
 * 공통 알림
 * - showModal()로 연 <dialog>는 top layer라 z-index로 못 이김 → popover(top layer)로 그림
 * - 알림이 바뀔 때마다 다시 띄워 그 사이 열린 모달보다 위로 올림
 * - 760 미만: 하단 막대(data-toast-above)가 화면에 있으면 그 위 끝에서 16px 위로 올림
 *   값이 있으면 그 안의 요소(채팅 모달 `footer`, AI 모달 `form`) 위 끝을 본다. 입력 줄이 늘어나도 따라감
 */
const GAP_PX = 16;

/** 두 문장 이상이면 문장마다 새 줄에서 시작(어절 중간에서 다음 문장이 이어지지 않게) */
const splitSentences = (message) => String(message).split(/(?<=[.?!])\s+/);
const MOBILE_QUERY = '(width < 760px)';

const getLiftPx = () => {
  if (!window.matchMedia(MOBILE_QUERY).matches) return null;
  const tops = [...document.querySelectorAll('[data-toast-above]')]
    .map((el) => {
      /** 값 없이 쓰면 React가 "true"로 그린다 → 요소 자신 */
      const selector = el.getAttribute('data-toast-above');
      return selector && selector !== 'true' ? el.querySelector(selector) : el;
    })
    .map((el) => el?.getBoundingClientRect())
    .filter((rect) => rect && rect.height > 0)
    .map((rect) => rect.top);
  if (tops.length === 0) return null;
  return Math.max(0, window.innerHeight - Math.min(...tops)) + GAP_PX;
};

/** 기본 위치는 className(바닥 24px), 올릴 때만 인라인 bottom */
const applyLift = (container) => {
  if (!container) return;
  const liftPx = getLiftPx();
  container.style.bottom = liftPx === null ? '' : `${liftPx}px`;
};

export default function ToastContainer() {
  const toasts = useSyncExternalStore(subscribe, getToasts);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (toasts.length > 0) applyLift(container);
    if (!container?.showPopover) return;
    if (container.matches(':popover-open')) container.hidePopover();
    container.showPopover();
  }, [toasts]);

  useEffect(() => {
    if (toasts.length === 0) return undefined;
    const update = () => applyLift(containerRef.current);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [toasts.length]);

  return (
    <div
      ref={containerRef}
      popover="manual"
      className="fixed inset-x-0 top-auto bottom-[calc(24px+env(safe-area-inset-bottom))] mx-auto my-0 flex w-fit flex-col items-center gap-2 overflow-visible border-0 bg-transparent p-0"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const { box, Icon } = TYPE_STYLE[toast.type] ?? TYPE_STYLE.info;
        return (
          <div
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : undefined}
            className={`flex max-w-[min(480px,calc(100vw-32px))] items-start gap-2 rounded-lg px-4 py-3 text-sm leading-[22px] tracking-[-0.03em] break-keep text-white shadow-lg ${box} ${
              toast.isLeaving
                ? 'animate-toast-out motion-reduce:hidden'
                : 'animate-toast-in motion-reduce:animate-none'
            }`}
          >
            {Icon && (
              <Icon size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
            )}
            <span className="min-w-0 text-pretty">
              {splitSentences(toast.message).map((sentence, index) => (
                <span key={index} className="block">
                  {sentence}
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}
