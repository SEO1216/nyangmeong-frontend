import { PawPrint } from 'lucide-react';
import Skeleton from '@/components/Skeleton';
import { BTN_PRIMARY } from '@/components/buttonStyles';

export default function PetEmpty({ onRegister, limit }) {
  return (
    <section className="rounded-card border border-line bg-white shadow-sm">
      <div className="flex flex-col items-center gap-2.5 px-6 py-16 text-center text-muted">
        <span className="grid size-16 place-items-center rounded-full bg-brand-50 text-brand-500">
          <PawPrint className="size-8" />
        </span>
        <p className="text-lg font-bold text-ink">
          아직 등록된 반려동물이 없어요
        </p>
        <p>
          반려동물을 등록하면 건강기록·케어미션·픽셀 캐릭터를 이용할 수 있어요
        </p>
        <button
          type="button"
          onClick={onRegister}
          className={`mt-3 ${BTN_PRIMARY}`}
        >
          반려동물 등록하기
        </button>
        {limit.isPending ? (
          <Skeleton className="-mt-1 h-5 w-64 max-w-full" />
        ) : (
          limit.data && (
            <p className="-mt-1 text-sm text-subtle">
              반려동물은 공동양육을 포함해 최대 {limit.data.petMaxCnt}마리까지
              등록할 수 있어요
            </p>
          )
        )}
      </div>
    </section>
  );
}
