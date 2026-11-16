import { useLayoutEffect, useRef, useState } from 'react';
import { CATEGORIES } from './placeData';

// indicator는 고른 탭 밑에 깔리는 배경이다. 탭을 바꾸면 이전 탭에서 새 탭으로 미끄러져 간다
const STYLES = {
  rail: {
    button: 'w-[54px] flex-col gap-1 rounded-card py-2.5 text-sm lg:w-[60px]',
    icon: 'size-6',
    indicator: 'rounded-card bg-brand-50',
    pressed: 'font-bold text-brand-600',
    normal: 'font-medium text-muted hover:bg-surface-2 hover:text-ink',
  },
  chips: {
    button: 'h-9 shrink-0 flex-row gap-1 rounded-full px-3.5 text-sm shadow-sm',
    icon: 'size-[18px]',
    indicator: 'rounded-full bg-brand-500',
    pressed: 'font-semibold text-white',
    normal: 'bg-white font-medium text-muted',
  },
};

// 부모(nav)가 relative여야 배경이 버튼 위치에 맞게 놓인다
export default function PlaceCategoryNav({ variant, category, onSelect }) {
  const style = STYLES[variant];
  const buttonRefs = useRef({});
  const [box, setBox] = useState(null);

  // 고른 탭의 위치·크기를 재서 배경을 옮긴다. 화면 크기가 바뀌면 다시 잰다
  useLayoutEffect(() => {
    const button = buttonRefs.current[category];
    if (!button) return;
    const measure = () =>
      setBox({
        top: button.offsetTop,
        left: button.offsetLeft,
        width: button.offsetWidth,
        height: button.offsetHeight,
      });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(button.parentElement);
    return () => observer.disconnect();
  }, [category]);

  return (
    <>
      {box && (
        <span
          aria-hidden="true"
          style={box}
          className={`pointer-events-none absolute z-[1] transition-[top,left,width,height] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${style.indicator}`}
        />
      )}
      {CATEGORIES.map((item) => {
        const { key, label } = item;
        const Icon = item.Icon;
        const isPressed = key === category;
        return (
          <button
            key={key}
            ref={(node) => {
              buttonRefs.current[key] = node;
            }}
            type="button"
            aria-pressed={isPressed}
            onClick={() => onSelect(key)}
            className={`relative flex items-center justify-center transition-colors duration-300 motion-reduce:transition-none ${style.button} ${
              isPressed ? style.pressed : style.normal
            }`}
          >
            <Icon className={`relative z-[2] ${style.icon}`} />
            <span className="relative z-[2]">{label}</span>
          </button>
        );
      })}
    </>
  );
}
