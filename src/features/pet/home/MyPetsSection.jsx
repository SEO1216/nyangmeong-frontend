import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LoadError from '@/components/LoadError';
import SkeletonCard from '@/components/SkeletonCard';
import { PATHS } from '@/routes/paths';
import PetEmpty from '../list/PetEmpty';
import PetFormModal from '../list/PetFormModal';
import { usePetLimit, usePets } from '../queries';
import PetMiniCard from './PetMiniCard';

/** 모바일(760px 미만)에서 처음 보이는 카드 수. PC(760px 이상)는 전부 보인다 */
const VISIBLE_COUNT = 6;

export default function MyPetsSection() {
  const { data: pets, isPending, isError, refetch } = usePets();
  const limit = usePetLimit();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const hiddenCount = Math.max((pets?.length ?? 0) - VISIBLE_COUNT, 0);

  return (
    <section aria-labelledby="home-pets" className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2
          id="home-pets"
          className="flex items-baseline gap-2 text-lg font-bold tracking-[-0.02em]"
        >
          내 반려동물
          {pets && (
            <small className="text-base font-medium text-subtle">
              {pets.length}마리
            </small>
          )}
        </h2>
        <Link
          to={PATHS.MYPAGE_PETS}
          className="inline-flex items-center font-medium text-muted hover:text-brand-600"
        >
          반려동물 관리
          <ChevronRight className="size-4" />
        </Link>
      </div>
      {isRegistering && (
        <PetFormModal onClose={() => setIsRegistering(false)} />
      )}
      {isPending ? (
        <div
          aria-busy="true"
          className="grid grid-cols-1 gap-3 min-[760px]:grid-cols-2 min-[1100px]:grid-cols-3 max-[760px]:gap-0 max-[760px]:overflow-hidden max-[760px]:rounded-card max-[760px]:border max-[760px]:border-line max-[760px]:bg-white max-[760px]:[&>div+div]:border-t max-[760px]:[&>div+div]:border-line-soft"
        >
          {Array.from({ length: VISIBLE_COUNT }, (_, index) => (
            <div key={index} className="flex min-w-0">
              <SkeletonCard className="h-[98px] w-full max-[760px]:h-[70px] max-[760px]:rounded-none! max-[760px]:border-0! max-[760px]:p-3!" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <LoadError
          message="반려동물을 불러오지 못했어요"
          onRetry={() => refetch()}
          className="py-10"
        />
      ) : pets.length === 0 ? (
        <PetEmpty onRegister={() => setIsRegistering(true)} limit={limit} />
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-3 min-[760px]:grid-cols-2 min-[1100px]:grid-cols-3 max-[760px]:gap-0 max-[760px]:overflow-hidden max-[760px]:rounded-card max-[760px]:border max-[760px]:border-line max-[760px]:bg-white max-[760px]:[&>li+li]:border-t max-[760px]:[&>li+li]:border-line-soft">
            {pets.map((pet, index) => (
              <li
                key={pet.petSn}
                className={`flex min-w-0 ${index >= VISIBLE_COUNT && !isExpanded ? 'max-[760px]:hidden' : ''}`}
              >
                <PetMiniCard pet={pet} index={index} />
              </li>
            ))}
          </ul>
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              className="inline-flex items-center gap-1 self-center font-medium text-muted hover:text-brand-600 min-[760px]:hidden"
            >
              {isExpanded ? '접기' : `더보기 +${hiddenCount}`}
              <ChevronDown
                className={`size-4 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </>
      )}
    </section>
  );
}
