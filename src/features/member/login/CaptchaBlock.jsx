import { RefreshCw } from 'lucide-react';
import AiErrorGuide from '@/components/AiErrorGuide';
import FieldError, { Required } from '@/components/FieldError';
import { INPUT, LABEL } from '@/components/formStyles';

const ART =
  'flex h-10 flex-1 items-center justify-center overflow-hidden rounded-md border border-line bg-surface-2';

export default function CaptchaBlock({
  image,
  isLoading,
  value,
  onChange,
  onRefresh,
  error,
  hasGuide,
}) {
  return (
    <div className="relative">
      <label htmlFor="login-captcha" className={`${LABEL} mb-2 text-ink`}>
        보안코드
        <Required />
      </label>
      <div className="mb-2 flex gap-2">
        <div className={ART}>
          {image && (
            <img
              src={image}
              alt="보안코드 이미지"
              className={`h-full w-full object-contain ${isLoading ? 'opacity-40' : ''}`}
            />
          )}
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="보안코드 새로고침"
          className="grid size-10 shrink-0 place-items-center rounded-md border border-input-line text-ink-2 hover:enabled:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className="size-5" />
        </button>
      </div>
      <input
        id="login-captcha"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="영문·숫자 6글자 입력"
        maxLength={6}
        autoComplete="off"
        aria-required="true"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'login-captcha-error' : undefined}
        className={INPUT}
      />
      {/* AI 안내가 붙으면 같은 문구가 두 번 보이지 않게 말풍선만 보인다. 말풍선은 aria-hidden이라 이 문구를 화면 읽기용으로 남긴다 */}
      {error && hasGuide && (
        <p id="login-captcha-error" role="alert" className="sr-only">
          {error}
        </p>
      )}
      {!hasGuide && <FieldError id="login-captcha-error">{error}</FieldError>}
      {error && hasGuide && <AiErrorGuide message={error} />}
    </div>
  );
}
