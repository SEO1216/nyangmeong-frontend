import { CircleX, Clock, MailX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BTN_PRIMARY } from '@/components/buttonStyles';
import { PATHS } from '@/routes/paths';
import { INVTN_STTS } from '../shared/petCodes';

/**
 * [초대 만료·종료 안내]
 * - 초대가 만료됐거나(발송 7일 경과) 이미 수락·거절됐을 때 수락 화면 대신 보인다 (FN-MYP-005-10, FN-MYP-005-04)
 * - 반려동물 카드·초대한 사람·재발송은 보이지 않음
 */
const MESSAGES = {
  expired: {
    Icon: Clock,
    title: '만료된 초대예요',
    descriptions: [
      '초대는 보낸 날부터 7일 동안만 받을 수 있어요.',
      '초대한 분께 다시 초대를 요청해 주세요.',
    ],
  },
  notFound: {
    Icon: MailX,
    title: '초대를 찾을 수 없어요',
    descriptions: ['삭제됐거나 잘못된 링크예요.', '링크를 다시 확인해 주세요.'],
  },
  canceled: {
    Icon: CircleX,
    title: '취소된 초대예요',
    descriptions: [
      '초대한 분이 이 초대를 취소했어요.',
      '필요하면 초대한 분께 다시 초대를 요청해 주세요.',
    ],
  },
  done: {
    Icon: Clock,
    title: '이미 처리된 초대예요',
    descriptions: [
      '이 초대는 이미 수락했거나 거절했어요.',
      '함께 돌보는 반려동물은 반려동물 관리에서 확인할 수 있어요.',
    ],
  },
};

const CLOSED_KIND = {
  [INVTN_STTS.EXPR]: 'expired',
  [INVTN_STTS.CNCL]: 'canceled',
};

/** invtnSttsCd 없이 부르면 초대를 찾을 수 없을 때(삭제됐거나 잘못된 링크)의 안내 */
export default function InvitationClosed({ invtnSttsCd }) {
  const kind = invtnSttsCd ? (CLOSED_KIND[invtnSttsCd] ?? 'done') : 'notFound';
  const { Icon, title, descriptions } = MESSAGES[kind];

  return (
    <section
      aria-labelledby="closed-title"
      className="mx-auto w-full max-w-[560px] overflow-hidden rounded-card border border-line bg-white shadow-depth-sm"
    >
      <div className="flex flex-col items-center gap-3 px-8 pt-10 pb-7 text-center">
        <span className="mb-2 grid size-[72px] place-items-center rounded-full bg-brand-50 text-brand-600">
          <Icon className="size-9" aria-hidden="true" />
        </span>
        <h2 id="closed-title" className="text-lg font-bold break-keep">
          {title}
        </h2>
        <p className="text-subtle break-keep">
          {descriptions[0]}
          <br />
          {descriptions[1]}
        </p>
      </div>
      <div className="flex items-center justify-end border-t border-line bg-white px-7 py-4 max-[760px]:px-5">
        <Link
          to={PATHS.MYPAGE}
          className={`${BTN_PRIMARY} max-[760px]:h-11 max-[760px]:w-full`}
        >
          마이페이지 홈으로
        </Link>
      </div>
    </section>
  );
}
