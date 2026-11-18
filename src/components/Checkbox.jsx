import { Check } from 'lucide-react';

/**
 * 체크박스 한 줄: 직접 그린 20px 네모 + 흰 체크(선택하면 청록 채움), 옆에 라벨(children)
 * ariaLabel: 보이는 라벨 없이 쓸 때 화면 읽기용 이름
 */
export default function Checkbox({
  checked,
  onChange,
  disabled = false,
  ariaLabel,
  className = '',
  children,
}) {
  return (
    <label
      className={`flex items-center gap-3 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={ariaLabel}
        className="peer sr-only"
      />
      <span className="grid size-5 shrink-0 place-items-center rounded-xs border-[1.5px] border-line-strong bg-white peer-checked:border-brand-500 peer-checked:bg-brand-500 peer-checked:[&_svg]:opacity-100 peer-focus-visible:ring-focus">
        <Check className="size-3.5 stroke-[3] text-white opacity-0" />
      </span>
      {children}
    </label>
  );
}
