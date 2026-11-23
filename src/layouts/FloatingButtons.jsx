import { PawPrint, Plus } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import arrow from '@/assets/arrow.svg';
import defaultCatCharacter from '@/assets/pets/default-character-cat-full.png';
import defaultDogCharacter from '@/assets/pets/default-character-dog-full.png';
import FileImage from '@/components/FileImage';
import { useMyPets } from '@/features/health/queries';
import { useMe } from '@/features/member/queries';
import PetFormModal from '@/features/pet/list/PetFormModal';
import { usePetLimit } from '@/features/pet/queries';
import useAiDock from '@/hooks/useAiDock';
import useAiWindow from '@/hooks/useAiWindow';
import { characterImageOptions } from '@/hooks/useCharacterImage';
import { useFileImage } from '@/hooks/useFileImage';
import { PATHS } from '@/routes/paths';
import { PET_SE } from '@/utils/petCodes';

export default function FloatingButtons({ hasBottomNav = false }) {
  const openAiWindow = useAiWindow();
  const isMain = useLocation().pathname === PATHS.MAIN;
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { data: me } = useMe();
  /** 메인은 버튼을 안 그리므로 말풍선도 본 것으로 치지 않음 */
  const dock = useAiDock({ mbrSn: me?.mbrSn, shown: !isMain });
  /** AI 버튼 캐릭터: 대표 반려동물만. 대표가 없으면 강아지 기본 캐릭터 */
  const { data: pets } = useMyPets();
  const facePet = pets?.find((pet) => pet.rprsPetYn) ?? null;
  /** 등록 버튼: 한도를 못 불러왔거나(불러오는 중·실패) 남은 자리가 없으면 숨김. AI 접힘 때도 숨김 */
  const { data: limit } = usePetLimit();
  const canRegister = limit?.remainingPetCount > 0 && !dock.folded;

  const handleAiClick = () => {
    if (!dock.consumeClick()) return;
    dock.closeBubble();
    openAiWindow(null, null, { from: 'fab' });
  };

  /** 메인은 검색창 [AI 매니저]가 있어 플로팅 버튼을 하나도 두지 않는다 */
  if (isMain) return null;

  return (
    /** 바텀 네비(60px)가 있으면 그 위로 올림. 모바일에서 접히면 우측 가장자리에 붙임.
     * z-20: 페이지 안 펼침 창(달력·셀렉트·⋮ 메뉴, z-30)이 겹치면 펼침 창이 위. 헤더·모달·드로워보다 아래 */
    <div
      className={`fixed bottom-6 z-20 flex flex-col items-center gap-3 ${
        dock.folded ? '-right-1' : 'right-6'
      } ${
        hasBottomNav
          ? 'max-[760px]:bottom-[calc(76px+env(safe-area-inset-bottom))]'
          : ''
      }`}
    >
      <div className="relative">
        {dock.bubbleVisible && (
          <div
            role="status"
            className="absolute right-full top-1/2 mr-[17px] -translate-y-1/2 animate-sway whitespace-nowrap motion-reduce:animate-none h-10 rounded-full border border-fab-line bg-linear-to-r from-fab-soft to-white px-4 text-base font-semibold leading-[38px] text-brand-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.05)]"
          >
            AI 매니저
            <svg
              aria-hidden="true"
              viewBox="0 0 12 14"
              className="absolute -right-[10px] top-1/2 h-[14px] w-[12px] -translate-y-1/2"
            >
              <path d="M1.3 1 L11 7 L1.3 13 Z" className="fill-white" />
              <path
                d="M1.3 1 L11 7 L1.3 13"
                className="fill-none stroke-fab-line"
              />
            </svg>
          </div>
        )}
        {dock.folded ? (
          <button
            type="button"
            className="relative flex h-16 w-8 items-center justify-center rounded-l-[32px] after:absolute after:inset-y-0 after:-left-3 after:right-0 after:content-[''] border border-r-0 border-fab-line bg-fab text-brand-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.05)]"
            aria-label="AI 매니저 펼치기"
            /** 보이는 탭은 32px, 누르는 영역은 왼쪽으로 12px 넓혀 44px */
            onClick={dock.expand}
          >
            <img src={arrow} alt="" width={7} height={13} />
          </button>
        ) : (
          <button
            type="button"
            className="flex touch-none items-center justify-center"
            style={{
              transform: `translateX(${dock.offset}px)`,
              transition: dock.dragging ? 'none' : 'transform 0.2s',
            }}
            aria-label="AI"
            onClick={handleAiClick}
            {...dock.dragHandlers}
          >
            {facePet ? <PetBody pet={facePet} /> : <DefaultBody />}
          </button>
        )}
      </div>
      {canRegister && (
        <button
          type="button"
          className="flex size-[52px] items-center justify-center gap-0.5 rounded-2xl border border-line bg-white text-ink-2 max-[760px]:size-11"
          aria-label="반려동물 등록"
          title="반려동물 등록"
          onClick={() => setIsRegisterOpen(true)}
        >
          {/** 발바닥 + 작은 더하기를 한 묶음으로 가운데 */}
          <PawPrint className="size-5" aria-hidden="true" />
          <Plus className="size-3" strokeWidth={3} aria-hidden="true" />
        </button>
      )}
      <button
        type="button"
        className="h-[52px] w-[52px] rounded-2xl border border-line bg-white text-base font-bold text-ink-2 max-[760px]:hidden"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        TOP
      </button>
      {/** 이동 없이 지금 화면에서 마이페이지와 같은 등록 모달을 연다. 등록하면 모달이 토스트를 띄우고 닫힌다 */}
      {isRegisterOpen && (
        <PetFormModal onClose={() => setIsRegisterOpen(false)} />
      )}
    </div>
  );
}

/** AI 버튼 캐릭터 크기: 512 그림에서 캐릭터는 높이 67%라, 보이는 높이 PC 80px·모바일 60px이 되게 그림을 120px·90px로 그리고 넘친 투명 여백은 음수 여백으로 상쇄(자리는 96px·72px).
 * 모바일은 오른쪽을 더 내보내(-17px) 캐릭터 오른쪽 끝이 화면 가장자리에서 지금처럼 약 24px에 오게 함.
 * AI 서버는 눈 가운데를 그림 가운데에 놓고 꼬리는 대개 오른쪽이라, 눈으로 가운데가 맞게 그림만 PC 4px·모바일 3px 왼쪽으로 옮김 */
const BODY_CLASS =
  'pointer-events-none -m-3 size-[120px] max-w-none shrink-0 -translate-x-1 rounded-2xl object-contain [image-rendering:pixelated] max-[760px]:-my-[9px] max-[760px]:-ml-[9px] max-[760px]:-mr-[17px] max-[760px]:size-[90px] max-[760px]:-translate-x-[3px]';

/** AI 버튼 대표 반려동물 캐릭터 전신. 오류 확인 중(bscCharSbstYn)이면 흑백, 이미지를 못 불러오면 그 종의 기본 캐릭터 */
function PetBody({ pet }) {
  const { src, isPending } = useFileImage(
    characterImageOptions(pet.petSn, 'full'),
  );
  const muted = pet.bscCharSbstYn ? 'opacity-55 grayscale' : '';
  return (
    <FileImage
      src={src}
      alt=""
      pending={isPending}
      className={`${BODY_CLASS} ${muted}`}
      fallback={<DefaultBody petSeCd={pet.petSeCd} className={muted} />}
    />
  );
}

/** 대표 반려동물이 없거나 캐릭터 이미지를 못 불러올 때: 우리 기본 캐릭터 전신(고양이가 아니면 강아지). 대표 캐릭터와 같은 512 배치라 크기·위치도 같다 */
function DefaultBody({ petSeCd, className = '' }) {
  const image =
    petSeCd === PET_SE.CAT ? defaultCatCharacter : defaultDogCharacter;
  return <img src={image} alt="" className={`${BODY_CLASS} ${className}`} />;
}
