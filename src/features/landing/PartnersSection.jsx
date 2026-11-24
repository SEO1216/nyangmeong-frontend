import FadeIn from './FadeIn';
import SectionTitle from './SectionTitle';
import { BANNER_CARDS } from './landingData';

export default function PartnersSection() {
  return (
    <section
      id="partners"
      className="relative flex w-full scroll-mt-20 flex-col items-center justify-center overflow-hidden bg-white min-h-[calc(100dvh-5rem)] py-20 lg:min-h-[max(870px,calc(100dvh-5rem))] lg:py-0"
    >
      <div className="flex w-full flex-col items-center px-4">
        <SectionTitle
          label="With pawever"
          title="함께하는 반려생활"
          desc="수첩, 메모장, 영수증에 흩어진 기록들을 쉽고 재미있게 관리해요."
          className="mb-12 lg:mb-20"
        />

        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-6">
          {BANNER_CARDS.map((card, index) => (
            <div
              key={card.title}
              className="group flex w-full max-w-[384px] flex-col"
            >
              <FadeIn delay={300 + index * 300}>
                <div className="aspect-[384/260] w-full overflow-hidden rounded-t-[20px] bg-[#c4c4c4]">
                  <img
                    src={card.image}
                    alt=""
                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
              </FadeIn>
              <FadeIn delay={600 + index * 300}>
                <h3 className="mt-6 text-[20px] leading-[150%] font-semibold text-ink lg:text-[24px]">
                  {card.title}
                </h3>
                <p className="mt-2 text-[16px] leading-[150%] font-normal whitespace-pre-line text-ink-2">
                  {card.description}
                </p>
              </FadeIn>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
