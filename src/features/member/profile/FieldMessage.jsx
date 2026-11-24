import { CircleCheck } from 'lucide-react';

export function OkText({ children }) {
  if (!children) return null;
  return (
    <p className="flex items-center gap-1 text-sm text-brand-500">
      <CircleCheck className="size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
