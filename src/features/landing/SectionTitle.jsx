import FadeIn from './FadeIn';

// 랜딩 섹션 머리(히어로 제외). 모든 섹션이 같은 영어 라벨·제목·설명 모양을 쓴다
export default function SectionTitle({ label, title, desc, className = '' }) {
  return (
    <FadeIn
      delay={100}
      className={`flex flex-col items-center space-y-4 text-center ${className}`}
    >
      <span className="text-[14px] font-medium tracking-wider text-[#2c6669] uppercase md:text-[18px] lg:text-[20px]">
        {label}
      </span>
      <h2 className="text-[28px] leading-tight font-normal break-keep text-black md:text-[40px] lg:text-[48px]">
        {title}
      </h2>
      {desc && (
        <p className="text-[14px] leading-relaxed break-keep text-black md:text-[18px] lg:text-[20px]">
          {desc}
        </p>
      )}
    </FadeIn>
  );
}
