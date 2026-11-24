import { useEffect, useRef, useState } from 'react';
import SectionTitle from './SectionTitle';
import { SERVICE_CARDS } from './landingData';

const COUNT = SERVICE_CARDS.length;
// 카드 한 장을 넘기는 데 쓰는 스크롤 길이(화면 높이 비율)
const STEP_VH = 70;

// 가운데에서 떨어진 칸 수(d)에 따른 카드 모양. 양옆은 작아지고 안쪽으로 기울며 흑백이 된다
function cardStyle(d) {
  const abs = Math.abs(d);
  return {
    transform: `translateX(calc(var(--gap) * ${d})) scale(${abs === 0 ? 1 : abs === 1 ? 0.84 : 0.7}) rotateY(${Math.max(-2, Math.min(2, d)) * -14}deg)`,
    zIndex: 10 - abs,
    opacity: abs > 2 ? 0 : 1,
    filter: abs === 0 ? 'none' : 'grayscale(1) brightness(0.8)',
  };
}

export default function ServiceSection() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);

  // 섹션 안에서 내려간 비율로 가운데 카드를 정한다. 섹션 높이를 카드 수만큼 늘리고 안쪽을 화면에 고정한다
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress =
        total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      setActive(Math.min(COUNT - 1, Math.floor(progress * COUNT)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // 점이나 옆 카드를 누르면 그 카드가 가운데 오는 스크롤 위치로 간다
  const goToCard = (index) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const total = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + ((index + 0.5) / COUNT) * total,
      behavior: 'smooth',
    });
  };

  return (
    <section
      id="service"
      ref={sectionRef}
      className="relative w-full bg-white"
      style={{ height: `calc(100dvh + ${(COUNT - 1) * STEP_VH}vh)` }}
    >
      <div className="sticky top-0 flex h-dvh w-full flex-col items-center justify-center overflow-x-clip px-6 pt-28 pb-20 md:pt-36 md:pb-28">
        <SectionTitle
          label="All-in-one Pet Care"
          title={
            <>
              기록부터 일상까지,
              <br className="md:hidden" /> pawever 서비스
            </>
          }
          desc={
            <>
              건강 일지부터 플레이스까지
              <br className="md:hidden" /> 반려생활에 필요한 것을 한곳에
              모았어요.
            </>
          }
        />

        <ul
          aria-label="pawever 서비스"
          className="relative mt-14 h-[342px] w-full [--gap:150px] [perspective:1200px] md:mt-20 md:[--gap:250px] lg:h-[402px] lg:[--gap:300px]"
        >
          {SERVICE_CARDS.map((card, index) => {
            const d = index - active;
            return (
              <li
                key={card.title}
                aria-hidden={d !== 0}
                className="absolute top-0 left-1/2 -ml-[127.5px] h-[342px] w-[255px] overflow-hidden rounded-3xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-[transform,opacity,filter] duration-500 ease-out motion-reduce:transition-none lg:-ml-[150px] lg:h-[402px] lg:w-[300px]"
                style={cardStyle(d)}
                onClick={d === 0 ? undefined : () => goToCard(index)}
              >
                <img
                  src={card.src}
                  alt=""
                  className="size-full object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/60 to-transparent px-5 pt-20 pb-6 text-white">
                  <p className="text-[20px] font-bold lg:text-[22px]">
                    {card.title}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-snug break-keep opacity-90 lg:text-[14px]">
                    {card.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex items-center gap-2 md:mt-10">
          {SERVICE_CARDS.map((card, index) => (
            <button
              key={card.title}
              type="button"
              aria-label={`${card.title} 보기`}
              aria-current={index === active}
              onClick={() => goToCard(index)}
              className={`h-2 rounded-full transition-[width,background-color] duration-300 ${
                index === active ? 'w-6 bg-brand-600' : 'w-2 bg-[#d5d8d6]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
