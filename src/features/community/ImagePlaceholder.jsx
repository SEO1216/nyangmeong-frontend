import { PawPrint } from 'lucide-react';

/**
 * 사진이 없거나 못 불러올 때 쓰는 회색 자리
 * - 회색 바탕 + 가운데 발자국 아이콘. 크기·모서리는 className(놓이는 칸)이 정한다
 */
export default function ImagePlaceholder({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center bg-surface-2 text-line-strong ${className}`}
    >
      <PawPrint size={48} />
    </span>
  );
}
