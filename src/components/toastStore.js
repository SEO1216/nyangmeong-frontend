const DURATION_MS = { info: 3000, success: 3000, error: 5000 };
/** 퇴장 애니메이션(index.css toast-out) 길이. 끝나면 목록에서 뺀다 */
const LEAVE_MS = 150;
const MAX_TOASTS = 3;

let toasts = [];
let nextId = 1;
const timers = new Map();
const listeners = new Set();

const emit = () => listeners.forEach((listener) => listener());

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getToasts = () => toasts;

const clearTimer = (id) => {
  clearTimeout(timers.get(id));
  timers.delete(id);
};

const remove = (id) => {
  clearTimer(id);
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
};

/** 흐려지는 동안 남겨 두었다가 뺀다 */
const leave = (id) => {
  clearTimer(id);
  toasts = toasts.map((toast) =>
    toast.id === id ? { ...toast, isLeaving: true } : toast,
  );
  emit();
  timers.set(
    id,
    setTimeout(() => remove(id), LEAVE_MS),
  );
};

const startTimer = (id, type) => {
  clearTimer(id);
  timers.set(
    id,
    setTimeout(() => leave(id), DURATION_MS[type]),
  );
};

/**
 * 컴포넌트 밖(mutation onError 등)에서도 호출 가능
 * - type: 'info'(기본, 아이콘 없음) | 'success'(완료) | 'error'(실패, 빨간 상자·5초)
 * - 같은 문구·type이 떠 있으면 새로 쌓지 않고 시간만 다시 센다
 * - 동시에 최대 3개, 넘으면 가장 오래된 것부터 흐려지며 빠진다
 */
export const showToast = (message, { type = 'info' } = {}) => {
  const same = toasts.find(
    (toast) =>
      !toast.isLeaving && toast.message === message && toast.type === type,
  );
  if (same) {
    startTimer(same.id, type);
    return;
  }

  const id = nextId++;
  toasts = [...toasts, { id, message, type, isLeaving: false }];
  const visible = toasts.filter((toast) => !toast.isLeaving);
  emit();
  startTimer(id, type);
  visible
    .slice(0, Math.max(0, visible.length - MAX_TOASTS))
    .forEach((toast) => leave(toast.id));
};
