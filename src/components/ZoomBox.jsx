import { useRef } from 'react';
import Icon from '@/components/Icon';
import { CHIP } from '@/components/buttonStyles';

/**
 * [사진 칸 한 개(16:10)] 오른쪽 아래 [크게 보기]. 칸 전체를 눌러도 같음
 * - image: { src, alt }, label: 확대 화면 제목
 * - onZoom({ image, label, trigger }): trigger는 확대 화면을 닫을 때 포커스를 되돌릴 [크게 보기]
 * - [크게 보기]는 따로 처리하지 않고 칸의 클릭으로 올라감(키보드 Enter도 같음)
 * - isFill: 16:10 대신 부모 크기를 꽉 채운다(그림은 비율 유지). 부모가 높이를 정해 줘야 한다
 * - 건강기록 둘러보기·메인 서비스 둘러보기가 같이 쓴다. 확대 화면은 ZoomOverlay
 */
export default function ZoomBox({
  image,
  label,
  isFill = false,
  className = '',
  onZoom,
  children,
}) {
  const buttonRef = useRef(null);
  return (
    <div
      className={`relative ${isFill ? 'size-full' : 'aspect-[16/10] w-full'} cursor-zoom-in overflow-hidden rounded-box ${className}`}
      onClick={() => onZoom({ image, label, trigger: buttonRef.current })}
    >
      {children}
      <img
        src={image.src}
        alt={image.alt}
        className="size-full object-contain"
      />
      <button
        ref={buttonRef}
        type="button"
        aria-label={`${label} 사진 크게 보기`}
        title="크게 보기"
        className={`${CHIP} absolute right-2 bottom-2 cursor-zoom-in`}
      >
        <Icon name="zoom_in" className="text-base" />
      </button>
    </div>
  );
}
