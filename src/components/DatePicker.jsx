import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'lucide-react';
import { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  getFixedOrigin,
  getPortalTarget,
  useLockOutsideScroll,
} from '@/hooks/useFloatingLayer';
import {
  formatDate,
  getTodayYmd,
  parseYmd,
  toYmd,
  WEEKDAYS,
} from '@/utils/formatDate';

const POPOVER_WIDTH = 296;
/** 모바일(760px 이하)에서는 칸 너비에 맞추되 이보다 좁아지지 않는다 */
const MOBILE_MIN_WIDTH = 280;
const MOBILE_MAX = 760;
const POPOVER_HEIGHT = 340;
const EDGE_GAP = 16;

const NAV_BUTTON =
  'grid size-8 place-items-center rounded-md text-muted hover:enabled:bg-surface-2 disabled:cursor-not-allowed disabled:text-line-strong';

/** 'YYYY-MM-DD'에 날짜 수를 더한다 */
const addDays = (ymd, days) => {
  const date = parseYmd(ymd);
  date.setDate(date.getDate() + days);
  return toYmd(date);
};

/** 같은 일자로 달을 옮긴다(그 달에 없는 일자는 말일) */
const addMonths = (ymd, months) => {
  const date = parseYmd(ymd);
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate();
  target.setDate(Math.min(date.getDate(), lastDay));
  return toYmd(target);
};

/** min·max 안으로 맞춘다 */
const clamp = (ymd, min, max) => {
  if (min && ymd < min) return min;
  if (max && ymd > max) return max;
  return ymd;
};

/**
 * 달력을 직접 그리는 날짜 칸 (브라우저 기본 날짜 입력 대신, 모든 기기 같은 모양)
 * - value: 'YYYY-MM-DD' 문자열, 빈 문자열이면 placeholder 표시. onChange에는 'YYYY-MM-DD' 문자열을 넘긴다
 * - min·max: 'YYYY-MM-DD', 밖의 날짜와 달 이동은 막힌다
 * - size: 'md'(기본, 높이 40px·16px) / 'sm'(높이 36px·14px) / 'xs'(높이 34px·14px)
 * - invalid: 빨간 테두리 + aria-invalid. id·describedBy: 칸 버튼에 붙는다(<label htmlFor>·오류 문구 연결)
 * - ref: 칸 버튼에 붙는다(바깥에서 포커스를 줄 때)
 * - 팝오버는 포털(모달 안이면 그 dialog, 아니면 body)에 fixed로 띄워 모달 본문 끝에 잘리지 않는다. 열린 동안 바깥 스크롤은 막는다
 * - 팝오버 너비: 데스크톱 296px, 모바일(760px 이하)은 칸 너비(최소 280px). 화면 좌우 16px 안으로 당겨 연다.
 *   연 채로 스크롤·창 크기를 바꾸면 위·아래 방향과 위치를 다시 잰다
 * - 키보드: ←→ 하루, ↑↓ 한 주 이동, Enter·Space 선택, Esc·Tab 닫기. 아래 공간이 모자라면 위로 열림
 * - 위 "YYYY년 M월"을 누르면 월 고르기 보기(연도 ◀ ▶ + 12달). 달을 고르면 그 달 날짜 보기로 돌아간다.
 *   월 보기 키보드: ←→ 한 달, ↑↓ 석 달, Enter·Space 그 달 날짜 보기, Esc 날짜 보기로
 */
export default function DatePicker({
  ref,
  value,
  onChange,
  min,
  max,
  label,
  placeholder = '날짜 선택',
  size = 'md',
  invalid = false,
  id,
  describedBy,
  disabled = false,
  className = '',
}) {
  const dialogId = useId();
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const layerRef = useRef(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const [portalTarget, setPortalTarget] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUp, setIsUp] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [popoverWidth, setPopoverWidth] = useState(POPOVER_WIDTH);
  const [activeYmd, setActiveYmd] = useState('');
  /** 'day' 날짜 보기 / 'month' 월 고르기 보기 */
  const [mode, setMode] = useState('day');

  useImperativeHandle(ref, () => buttonRef.current, []);

  const today = getTodayYmd();
  const isOutOfRange = (ymd) => (min && ymd < min) || (max && ymd > max);

  /** 칸 위치로 팝오버 방향·너비·좌우 위치를 잰다 */
  const measure = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    setAnchorRect(rect);
    const below = window.innerHeight - rect.bottom;
    setIsUp(below < POPOVER_HEIGHT && rect.top > below);
    const isMobile = window.innerWidth <= MOBILE_MAX;
    const width = Math.min(
      isMobile ? Math.max(rect.width, MOBILE_MIN_WIDTH) : POPOVER_WIDTH,
      window.innerWidth - EDGE_GAP * 2,
    );
    setPopoverWidth(width);
    const overflowRight = rect.left + width - (window.innerWidth - EDGE_GAP);
    setOffsetX(
      overflowRight > 0 ? Math.max(-overflowRight, EDGE_GAP - rect.left) : 0,
    );
  };

  const open = () => {
    setPortalTarget(getPortalTarget(buttonRef.current));
    measure();
    setActiveYmd(clamp(value || today, min, max));
    setMode('day');
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const pick = (ymd) => {
    if (isOutOfRange(ymd)) return;
    onChange(ymd);
    close();
    buttonRef.current.focus();
  };

  /** 바깥을 누르면 닫힘 */
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleMouseDown = (event) => {
      if (
        !rootRef.current.contains(event.target) &&
        !layerRef.current?.contains(event.target)
      )
        setIsOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen]);

  useLockOutsideScroll(isOpen, layerRef);

  /** 연 채로 스크롤·리사이즈하면 다시 잰다(위로 밀려 화면 밖으로 나가지 않게) */
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleChange = () => measure();
    window.addEventListener('scroll', handleChange, true);
    window.addEventListener('resize', handleChange);
    return () => {
      window.removeEventListener('scroll', handleChange, true);
      window.removeEventListener('resize', handleChange);
    };
  }, [isOpen]);

  const moveActive = (days) => {
    const next = addDays(activeYmd, days);
    if (!isOutOfRange(next)) setActiveYmd(next);
  };

  const handleKeyDown = (event) => {
    if (!isOpen) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        open();
      }
      return;
    }
    if (mode === 'month') {
      const monthSteps = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -3,
        ArrowDown: 3,
      };
      if (event.key in monthSteps) {
        event.preventDefault();
        moveMonth(monthSteps[event.key]);
      } else if (
        event.key === 'Enter' ||
        event.key === ' ' ||
        event.key === 'Escape'
      ) {
        event.preventDefault();
        setMode('day');
      } else if (event.key === 'Tab') {
        close();
      }
      return;
    }
    const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (event.key in steps) {
      event.preventDefault();
      moveActive(steps[event.key]);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      pick(activeYmd);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'Tab') {
      close();
    }
  };

  /** 보고 있는 달: 키보드로 옮긴 날짜가 있는 달 */
  const viewDate = activeYmd ? parseYmd(activeYmd) : new Date();
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const dayCount = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthLast = toYmd(new Date(viewYear, viewMonth, 0));
  const nextMonthFirst = toYmd(new Date(viewYear, viewMonth + 1, 1));
  const isPrevDisabled = Boolean(min) && prevMonthLast < min;
  const isNextDisabled = Boolean(max) && nextMonthFirst > max;

  const moveMonth = (months) =>
    setActiveYmd(clamp(addMonths(activeYmd, months), min, max));

  /** 월 보기: 그 달이 통째로 min·max 밖이면 고를 수 없다 */
  const isMonthOut = (year, month) =>
    (Boolean(min) && toYmd(new Date(year, month + 1, 0)) < min) ||
    (Boolean(max) && toYmd(new Date(year, month, 1)) > max);
  const isPrevYearDisabled = Boolean(min) && `${viewYear - 1}-12-31` < min;
  const isNextYearDisabled = Boolean(max) && `${viewYear + 1}-01-01` > max;

  const pickMonth = (month) => {
    if (isMonthOut(viewYear, month)) return;
    setActiveYmd(clamp(addMonths(activeYmd, month - viewMonth), min, max));
    setMode('day');
  };

  const borderClass = invalid
    ? `border-danger ${isOpen ? 'shadow-[0_0_0_3px_rgba(180,71,58,0.18)]' : ''}`
    : isOpen
      ? 'border-brand-500 shadow-[0_0_0_3px_rgba(182,218,172,0.5)]'
      : 'border-input-line hover:enabled:border-line-strong';
  let labelColor = 'text-placeholder';
  if (disabled) labelColor = 'text-subtle';
  else if (value) labelColor = 'text-ink';

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        id={id}
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? dialogId : undefined}
        disabled={disabled}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleKeyDown}
        className={`flex w-full cursor-pointer items-center rounded-md border bg-white pr-9 pl-3 text-left focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-2 ${size === 'xs' ? 'h-[34px] text-sm' : size === 'sm' ? 'h-9 text-sm' : 'h-10 text-base max-[760px]:h-11'} ${borderClass}`}
      >
        <span className={`min-w-0 flex-1 truncate ${labelColor}`}>
          {value ? formatDate(value) : placeholder}
        </span>
        <CalendarDays
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted"
        />
      </button>
      {isOpen &&
        anchorRect &&
        portalTarget &&
        createPortal(
          <div
            ref={layerRef}
            id={dialogId}
            role="dialog"
            aria-label={label ? `${label} 달력` : '달력'}
            onMouseDown={(event) => event.preventDefault()}
            // <label> 안에 둘 때 달력 클릭이 라벨을 거쳐 칸 버튼을 다시 누르지 않게
            onClick={(event) => event.preventDefault()}
            // 칸 아래(위로 열 때는 칸 위) 6px. fixed 기준점이 화면이 아니면 그만큼 뺀다
            style={{
              left: anchorRect.left + offsetX - getFixedOrigin(portalTarget).x,
              top:
                (isUp ? anchorRect.top - 6 : anchorRect.bottom + 6) -
                getFixedOrigin(portalTarget).y,
              width: popoverWidth,
              transform: isUp ? 'translateY(-100%)' : undefined,
            }}
            className="fixed z-30 rounded-lg border border-line bg-white p-3 text-left shadow-[0_12px_32px_-8px_rgba(15,23,35,0.18),0_2px_6px_rgba(15,23,35,0.06)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                aria-label={mode === 'month' ? '이전 해' : '이전 달'}
                disabled={
                  mode === 'month' ? isPrevYearDisabled : isPrevDisabled
                }
                onClick={() => moveMonth(mode === 'month' ? -12 : -1)}
                className={NAV_BUTTON}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-live="polite"
                aria-expanded={mode === 'month'}
                aria-label={
                  mode === 'month'
                    ? `${viewYear}년, 날짜 보기로`
                    : `${viewYear}년 ${viewMonth + 1}월, 월 고르기`
                }
                onClick={() => setMode(mode === 'month' ? 'day' : 'month')}
                className="flex h-8 items-center gap-1 rounded-md px-2 text-base leading-tight font-semibold tracking-[-0.03em] text-ink hover:bg-surface-2"
              >
                {mode === 'month'
                  ? `${viewYear}년`
                  : `${viewYear}년 ${viewMonth + 1}월`}
                {mode === 'month' ? (
                  <ChevronUp
                    size={16}
                    aria-hidden="true"
                    className="text-muted"
                  />
                ) : (
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className="text-muted"
                  />
                )}
              </button>
              <button
                type="button"
                aria-label={mode === 'month' ? '다음 해' : '다음 달'}
                disabled={
                  mode === 'month' ? isNextYearDisabled : isNextDisabled
                }
                onClick={() => moveMonth(mode === 'month' ? 12 : 1)}
                className={NAV_BUTTON}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
            {mode === 'month' && (
              <div className="grid grid-cols-4 gap-1 py-1">
                {Array.from({ length: 12 }, (_, month) => {
                  const isDisabled = isMonthOut(viewYear, month);
                  const isSelected =
                    Boolean(value) &&
                    value.slice(0, 7) ===
                      toYmd(new Date(viewYear, month, 1)).slice(0, 7);
                  const isActive = month === viewMonth;
                  return (
                    <button
                      key={month}
                      type="button"
                      tabIndex={-1}
                      disabled={isDisabled}
                      aria-pressed={isSelected}
                      onClick={() => pickMonth(month)}
                      className={`flex h-14 items-center justify-center rounded-md text-sm leading-tight tracking-[-0.03em] disabled:cursor-not-allowed disabled:text-line-strong ${
                        isSelected
                          ? 'bg-brand-50 font-semibold text-brand-600'
                          : `text-ink hover:enabled:bg-surface-2 ${isActive && !isDisabled ? 'ring-1 ring-line-strong ring-inset' : ''}`
                      }`}
                    >
                      {month + 1}월
                    </button>
                  );
                })}
              </div>
            )}
            <div
              className={`grid grid-cols-7 text-center ${mode === 'month' ? 'hidden' : ''}`}
            >
              {[...WEEKDAYS].map((weekday) => (
                <span
                  key={weekday}
                  className="flex h-8 items-center justify-center text-xs leading-tight tracking-[-0.01em] text-placeholder"
                >
                  {weekday}
                </span>
              ))}
              {Array.from({ length: firstWeekday }, (_, index) => (
                <span key={`blank-${index}`} aria-hidden="true" />
              ))}
              {Array.from({ length: dayCount }, (_, index) => {
                const day = index + 1;
                const ymd = toYmd(new Date(viewYear, viewMonth, day));
                const isSelected = ymd === value;
                const isActive = ymd === activeYmd;
                const isToday = ymd === today;
                const isDisabled = isOutOfRange(ymd);
                return (
                  <button
                    key={ymd}
                    type="button"
                    tabIndex={-1}
                    disabled={isDisabled}
                    aria-label={formatDate(ymd, { weekday: true })}
                    aria-pressed={isSelected}
                    aria-current={isToday ? 'date' : undefined}
                    onClick={() => pick(ymd)}
                    onMouseEnter={() => setActiveYmd(ymd)}
                    className={`mx-auto flex size-9 items-center justify-center rounded-md text-sm leading-tight tracking-[-0.03em] disabled:cursor-not-allowed disabled:text-line-strong ${
                      isSelected
                        ? 'bg-brand-50 font-semibold text-brand-600'
                        : `text-ink ${isActive && !isDisabled ? 'bg-surface-2' : ''}`
                    } ${isToday && !isSelected ? 'font-semibold ring-1 ring-line-strong ring-inset' : ''}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>,
          portalTarget,
        )}
    </div>
  );
}
