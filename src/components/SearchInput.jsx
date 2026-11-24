import { Search } from 'lucide-react';

/** 검색창: 입력값은 부모 보관, 제출할 때만 onSubmit 호출. compact: 높이 34px·글자 14px */
export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  compact = false,
  className = '',
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`w-full rounded-md border border-input-line bg-white pr-10 pl-3 ${compact ? 'h-[34px] text-sm' : 'h-10 text-base'} placeholder:text-placeholder hover:border-line-strong focus:border-brand-500 focus:outline-none focus:ring-focus`}
      />
      <button
        type="submit"
        aria-label="검색"
        className="absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center text-muted"
      >
        <Search size={20} />
      </button>
    </form>
  );
}
