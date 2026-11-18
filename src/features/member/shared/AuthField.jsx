import { useState } from 'react';
import { ArrowBigUpDash, Eye, EyeOff } from 'lucide-react';
import AiErrorGuide from '@/components/AiErrorGuide';
import FieldError, { Required } from '@/components/FieldError';
import { HELP, LABEL } from '@/components/formStyles';
import useCapsLock from '@/hooks/useCapsLock';

// 칸 겉틀은 공용 INPUT(components/formStyles)과 같은 값. 아이콘·비밀번호 보기 버튼이 같은 테두리 안에 있어 focus-within으로 둔다
// 포커스 링은 상태별로 하나만 붙인다(초록·빨강 링이 겹치면 초록이 이김, 추가-2)
const WRAP = 'flex h-10 items-center gap-2.5 rounded-md border bg-white px-3';

export default function AuthField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  error,
  help,
  success,
  endAdornment,
  action,
  readOnly,
  hasGuide,
  icon,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const { isCapsOn, capsProps } = useCapsLock();
  const isPassword = type === 'password';
  const Icon = icon;

  return (
    <div className="relative">
      <label htmlFor={id} className={`${LABEL} mb-1.5 text-ink`}>
        {label}
        <Required />
      </label>
      <div className="flex gap-2">
        <div
          className={`${WRAP} min-w-0 flex-1 ${
            error
              ? 'border-danger focus-within:ring-error'
              : 'border-input-line hover:border-line-strong focus-within:border-brand-500 focus-within:ring-focus'
          } ${readOnly ? 'bg-surface-2' : ''}`}
        >
          {Icon && <Icon className="size-5 shrink-0 text-subtle" />}
          <input
            id={id}
            type={isPassword && isVisible ? 'text' : type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            autoComplete={autoComplete}
            inputMode={inputMode}
            maxLength={maxLength}
            readOnly={readOnly}
            aria-required="true"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className="h-full min-w-0 flex-1 bg-transparent placeholder:text-placeholder focus:outline-none"
            {...(isPassword ? capsProps : {})}
          />
          {endAdornment}
          {isPassword && (
            <button
              type="button"
              onClick={() => setIsVisible((prev) => !prev)}
              aria-label={isVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
              className="grid place-items-center text-subtle hover:text-ink"
            >
              {isVisible ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          )}
        </div>
        {action}
      </div>
      {isPassword && isCapsOn && (
        <p className="mt-2 flex items-center gap-1 text-sm text-warn">
          <ArrowBigUpDash className="size-4" />
          Caps Lock이 켜져 있습니다.
        </p>
      )}
      {/* AI 안내가 붙으면 같은 문구가 두 번 보이지 않게 말풍선만 보인다. 말풍선은 aria-hidden이라 이 문구를 화면 읽기용으로 남긴다 */}
      {error && hasGuide && (
        <p id={`${id}-error`} role="alert" className="sr-only">
          {error}
        </p>
      )}
      {!hasGuide && <FieldError id={`${id}-error`}>{error}</FieldError>}
      {!error && success && (
        <p className="mt-1.5 text-sm leading-5 text-tone-green-fg">{success}</p>
      )}
      {!error && !success && help && <p className={`${HELP} mt-1.5`}>{help}</p>}
      {error && hasGuide && <AiErrorGuide message={error} />}
    </div>
  );
}
