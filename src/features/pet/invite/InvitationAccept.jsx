import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Checkbox from '@/components/Checkbox';
import NoticeBox from '@/components/NoticeBox';
import SkeletonCard from '@/components/SkeletonCard';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import { showToast } from '@/components/toastStore';
import { PATHS } from '@/routes/paths';
import { useAcceptInvitation, useInvitation, usePetLimit } from '../queries';
import PetFace from '@/components/PetFace';
import InvitationClosed from './InvitationClosed';
import InvitationMismatch from './InvitationMismatch';
import InvitationRejectDialog from './InvitationRejectDialog';

/**
 * [초대 수락]
 * - 카드마다 체크로 수락할 반려동물을 고른다(처음엔 모두 선택, 1마리 이상이어야 [수락] 활성). 고르지 않은 동물은 거절 처리
 * - [거절]은 선택과 관계없이 초대 전체 거절
 * - 수락 -> 반려동물 관리로 이동해 방금 연동된 동물 표시
 * - 초대받은 이메일과 로그인 계정이 다르면(emailMatched === false) 수락 화면 대신 안내
 * - 카드의 품종은 직접 입력(vrtyDrctInptNm) 우선, 서버가 두 필드를 주기 전까지는 값이 없어 줄이 숨겨진다(나이는 표시하지 않음)
 * - 만료·처리된 초대는 이 화면에 오지 않음(InvitationPage가 InvitationClosed로 전달)
 */

const CARD =
  'mx-auto w-full max-w-[560px] overflow-hidden rounded-card border border-line bg-white shadow-depth-sm';

function InvitePetCard({ pet, checked, disabled, onToggle }) {
  const desc = pet.vrtyDrctInptNm || pet.vrtyNm;
  return (
    <li>
      <div
        className={`relative flex flex-col items-center gap-1 rounded-box bg-surface-2 px-5 pt-6 pb-4 text-center shadow-[inset_0_0_0_1.5px_var(--color-line)] has-checked:bg-brand-50 has-checked:shadow-[inset_0_0_0_2px_var(--color-brand-500)] ${disabled ? 'opacity-50' : ''}`}
      >
        {/* 카드 전체가 누르는 영역: 공용 체크박스 라벨을 카드 위에 덮고 네모는 왼쪽 위 */}
        <Checkbox
          checked={checked}
          disabled={disabled}
          onChange={onToggle}
          ariaLabel={`${pet.petNm} 수락`}
          className="absolute inset-0 z-[1] items-start! p-3"
        />
        <PetFace
          petSn={pet.petSn}
          petSeCd={pet.petSeCd}
          isError={pet.bscCharSbstYn}
          className="mb-2 size-28 rounded-full bg-white text-brand-500"
          iconClassName="size-12"
        />
        <b>{pet.petNm}</b>
        {desc && <span className="text-sm text-subtle">{desc}</span>}
      </div>
    </li>
  );
}

export default function InvitationAccept({
  jntBrupInvtnSn,
  onSwitchAccount,
  isSwitching,
}) {
  const navigate = useNavigate();
  const {
    data: invitation,
    isPending,
    isError,
  } = useInvitation(jntBrupInvtnSn);
  const acceptInvitation = useAcceptInvitation();
  const petLimit = usePetLimit();
  const [isRejecting, setIsRejecting] = useState(false);
  /** null: 손대기 전(초대의 모든 동물이 선택된 상태) */
  const [selectedPetSns, setSelectedPetSns] = useState(null);
  /** 수락 400이 알려 준 남은 자리(없으면 초대 상세의 remainingPetCount) */
  const [limitOverride, setLimitOverride] = useState(null);

  if (isPending) {
    return (
      <div aria-busy="true">
        <SkeletonCard className="mx-auto h-[477px] w-full max-w-[560px]" />
      </div>
    );
  }
  if (isError) {
    return <InvitationClosed />;
  }

  if (!invitation.emailMatched) {
    return (
      <InvitationMismatch
        invtnTrgtEmlMask={invitation.invtnTrgtEmlMask}
        onLogin={onSwitchAccount}
        isPending={isSwitching}
      />
    );
  }

  const petNames = invitation.pets.map((pet) => pet.petNm).join(', ');
  /** 더 받을 수 있는 수. 서버가 값을 주지 않으면 제한 없음 */
  const limit =
    limitOverride ?? invitation.remainingPetCount ?? invitation.pets.length;
  const isLimited = limit < invitation.pets.length;
  /** 불러오는 중이거나 실패하면 undefined라 최대 수 문장을 뺀다 */
  const petMaxCnt = petLimit.data?.petMaxCnt;
  const pickedPetSns = (
    selectedPetSns ?? invitation.pets.map((pet) => pet.petSn)
  ).slice(0, limit);

  const handleToggle = (petSn) => {
    if (pickedPetSns.includes(petSn)) {
      setSelectedPetSns(pickedPetSns.filter((sn) => sn !== petSn));
    } else if (pickedPetSns.length < limit) {
      setSelectedPetSns([...pickedPetSns, petSn]);
    }
  };

  const handleAccept = () =>
    acceptInvitation.mutate(
      { jntBrupInvtnSn, petSns: pickedPetSns },
      {
        onSuccess: () =>
          navigate(PATHS.MYPAGE_PETS, {
            state: {
              petSn: invitation.pets.find((pet) =>
                pickedPetSns.includes(pet.petSn),
              ).petSn,
            },
          }),
        onError: (error) => {
          showToast(error.message);
          const remaining = error.data?.remainingPetCount;
          if (error.code === 'PET_LIMIT_EXCEEDED' && remaining != null) {
            setLimitOverride(remaining);
            setSelectedPetSns(pickedPetSns.slice(0, remaining));
          }
        },
      },
    );

  return (
    <section aria-labelledby="invitation-title" className={CARD}>
      <div className="border-b border-line-strong px-7 pt-4 pb-2">
        <h2
          id="invitation-title"
          className="text-lg leading-[1.35] font-bold break-keep"
        >
          {petNames}의 공동양육자가 되어주세요
        </h2>
        <p className="mt-1 text-muted">
          {invitation.sndrMbrNcnm}님이 초대했어요
        </p>
      </div>
      <div className="flex flex-col gap-5 px-6 pt-5 pb-6">
        {isLimited && (
          <NoticeBox tone="warn" role="status">
            {petMaxCnt != null &&
              `반려동물은 공동양육을 포함해 ${petMaxCnt}마리까지예요. `}
            {limit === 0
              ? '지금은 더 받을 자리가 없어 수락할 수 없어요'
              : `${limit}마리 더 받을 수 있어요`}
          </NoticeBox>
        )}
        <ul className="grid grid-cols-2 gap-3">
          {invitation.pets.map((pet) => (
            <InvitePetCard
              key={pet.petSn}
              pet={pet}
              checked={pickedPetSns.includes(pet.petSn)}
              disabled={
                !pickedPetSns.includes(pet.petSn) &&
                pickedPetSns.length >= limit
              }
              onToggle={() => handleToggle(pet.petSn)}
            />
          ))}
        </ul>
        {limit > 0 && (
          <NoticeBox>
            함께 돌볼 반려동물을 골라 주세요. 빼면 그 반려동물만 거절돼요
          </NoticeBox>
        )}
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-line bg-white px-7 py-4">
        <Link
          to={PATHS.MYPAGE}
          className="inline-flex h-10 items-center justify-center rounded-md px-4 font-semibold text-ink-2 hover:bg-surface-2"
        >
          나중에 하기
        </Link>
        <button
          type="button"
          onClick={() => setIsRejecting(true)}
          disabled={acceptInvitation.isPending}
          className={BTN_SECONDARY}
        >
          거절
        </button>
        <button
          type="button"
          onClick={handleAccept}
          disabled={acceptInvitation.isPending || pickedPetSns.length === 0}
          className={BTN_PRIMARY}
        >
          수락
        </button>
      </div>
      {isRejecting && (
        <InvitationRejectDialog
          invitation={invitation}
          onClose={() => setIsRejecting(false)}
        />
      )}
    </section>
  );
}
