import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { TAG } from '../checkup/checkupStyles';
import { BLOOD_ITEM_GROUPS, findBloodItem } from './bloodItems';

export const DIRECT = '__direct';

/** 목록에 줄 세울 행: 묶음 이름(고를 수 없음)과 항목 */
const ROWS = [
  ...BLOOD_ITEM_GROUPS.flatMap((group) => [
    { type: 'group', key: group.cd, label: group.nm },
    ...group.items.map((item) => ({ type: 'option', key: item.ab, ...item })),
  ]),
  { type: 'option', key: DIRECT },
];
const OPTIONS = ROWS.filter((row) => row.type === 'option');

const ROW_CLASS =
  'flex h-9 cursor-pointer items-center gap-2 rounded px-2.5 pt-px text-base';

/**
 * [검사 항목 드롭다운] (FN-HLT-007-02)
 * - 혈구·신장·간·당 4묶음에 약어 + 한글 이름, 맨 아래 직접입력
 * - value: 약어, DIRECT, 또는 고르지 않았을 때 ''
 * - 키보드: ↑↓ 이동, Enter·Space 선택, Esc·Tab 닫기
 */
export default function ItemSelect({
  value,
  disabled,
  labelId,
  isInvalid,
  onChange,
}) {
  const listId = useId();
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedIndex = OPTIONS.findIndex((option) => option.key === value);

  const open = () => {
    setActiveIndex(Math.max(selectedIndex, 0));
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const pick = (index) => {
    onChange(OPTIONS[index].key);
    close();
    buttonRef.current.focus();
  };

  /** 바깥을 누르면 닫힘 */
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleMouseDown = (event) => {
      if (!rootRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen]);

  /** 키보드로 옮긴 항목이 목록 밖이면 보이게 스크롤 */
  useEffect(() => {
    if (isOpen) {
      listRef.current
        .querySelector(`[data-index="${activeIndex}"]`)
        ?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, activeIndex]);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        open();
        return;
      }
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((activeIndex + step + OPTIONS.length) % OPTIONS.length);
    } else if ((event.key === 'Enter' || event.key === ' ') && isOpen) {
      event.preventDefault();
      pick(activeIndex);
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      close();
    } else if (event.key === 'Tab' && isOpen) {
      close();
    }
  };

  const selected = selectedIndex >= 0 ? OPTIONS[selectedIndex] : null;
  const selectedBlood = selected ? findBloodItem(selected.key) : null;

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-labelledby={labelId}
        aria-invalid={isInvalid}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleKeyDown}
        className={`flex h-10 w-full cursor-pointer items-center gap-2 rounded-md border bg-white pr-9 pl-3 text-left text-base hover:enabled:border-line-strong focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-subtle aria-invalid:border-danger max-[760px]:h-11 ${isOpen ? 'border-brand-500 shadow-[0_0_0_3px_rgba(182,218,172,0.5)]' : 'border-input-line'}`}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
          {selectedBlood ? (
            <>
              <span className={TAG}>{selectedBlood.tagNm}</span>
              {selectedBlood.ab}
              <span className="text-subtle">{selectedBlood.kn}</span>
            </>
          ) : selected ? (
            '직접입력'
          ) : (
            <span className="text-placeholder">검사 항목을 선택해 주세요</span>
          )}
        </span>
        <ChevronDown
          size={20}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted"
        />
      </button>
      {isOpen && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className="absolute right-0 left-0 z-30 mt-1.5 max-h-64 overflow-y-auto rounded-lg border border-line bg-white p-1 shadow-[0_12px_32px_-8px_rgba(15,23,35,0.18),0_2px_6px_rgba(15,23,35,0.06)]"
        >
          {ROWS.map((row) => {
            if (row.type === 'group') {
              return (
                <li
                  key={row.key}
                  role="presentation"
                  className="px-3 pt-2 pb-1 text-sm text-subtle"
                >
                  {row.label}
                </li>
              );
            }
            const index = OPTIONS.indexOf(row);
            const isSelected = index === selectedIndex;
            const isDirect = row.key === DIRECT;
            return (
              <li
                key={row.key}
                id={`${listId}-${index}`}
                data-index={index}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(index)}
                className={`${ROW_CLASS} ${isDirect ? 'mt-1 rounded-none border-t border-line pl-2.5' : 'pl-5'} ${isSelected ? 'bg-brand-50 font-semibold text-brand-600' : 'text-ink'} ${index === activeIndex && !isSelected ? 'bg-surface-2' : ''} ${isSelected ? '' : 'hover:bg-surface-2'}`}
              >
                {isDirect ? (
                  <>
                    직접입력
                    <span className="font-normal text-subtle">
                      — 태그·이름 없음
                    </span>
                  </>
                ) : (
                  <>
                    <span className="min-w-14">{row.ab}</span>
                    <span className="font-normal text-subtle">{row.kn}</span>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
