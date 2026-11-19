import { Clock, Headset, ImageIcon, Lock } from 'lucide-react';
import { useState } from 'react';
import { generatePath, Link, useNavigate } from 'react-router-dom';
import Badge from '@/components/Badge';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import ConfirmModal from '@/components/ConfirmModal';
import ImageViewer from '@/components/ImageViewer';
import PostBody from '@/components/PostBody';
import { showToast } from '@/components/toastStore';
import { PATHS } from '@/routes/paths';
import { formatDate } from '@/utils/formatDate';
import { isAnswered } from './api';
import InquiryStatusBadge from './InquiryStatusBadge';
import { useDeleteInquiry, useInquiryImageUrls } from './queries';

/** 모바일은 두 버튼이 반씩, 높이 48(누르는 영역 44 이상) */
const ACTION_SIZE =
  'min-w-[120px] max-[760px]:h-12 max-[760px]:min-w-0 max-[760px]:flex-1';

/** '2026-09-18T14:32:00' → '2026.09.18 14:32' */
const formatDateTime = (value) => `${formatDate(value)} ${value.slice(11, 16)}`;

export default function InquiryDetail({ inquiry }) {
  const answered = isAnswered(inquiry);
  const { imgs } = inquiry;
  const urls = useInquiryImageUrls(inquiry.otoInqrySn, imgs);
  const [viewerIndex, setViewerIndex] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const remove = useDeleteInquiry();
  const navigate = useNavigate();

  return (
    <article className="rounded-[14px] border border-line bg-white px-9 pt-8 pb-8 max-[760px]:px-5 max-[760px]:pt-6 max-[760px]:pb-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="outline">{inquiry.inqryTypeCdNm}</Badge>
        <InquiryStatusBadge isAnswered={answered} />
      </div>
      <h2 className="mt-3 text-2xl leading-[1.35] font-bold tracking-[-0.01em] text-ink max-[760px]:text-lg">
        {inquiry.inqryTtl}
      </h2>
      <p className="mt-4 flex items-center gap-2 border-b border-line pb-6 text-sm text-subtle">
        <span>접수일</span>
        <time>{formatDateTime(inquiry.regDt)}</time>
      </p>

      <PostBody content={inquiry.inqryCn}>
        {imgs.length > 0 && (
          <>
            <p className="text-sm font-semibold text-muted">
              첨부 이미지 {imgs.length}
            </p>
            <ul className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(120px,148px))] gap-3 max-[760px]:grid-cols-3 max-[760px]:gap-2">
              {imgs.map((img, index) => (
                <li key={img.atchFileSn}>
                  <button
                    type="button"
                    aria-label={`첨부 이미지 ${index + 1} 크게 보기`}
                    onClick={() => setViewerIndex(index)}
                    className="grid aspect-square w-full cursor-pointer place-items-center overflow-hidden rounded-[10px] border border-line bg-surface-2 text-line-strong"
                  >
                    {urls[img.atchFileSn] ? (
                      <img
                        src={urls[img.atchFileSn]}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={32} aria-hidden="true" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </PostBody>

      {viewerIndex !== null && (
        <ImageViewer
          images={imgs.map((img, index) => ({
            key: img.atchFileSn,
            src: urls[img.atchFileSn],
            name: img.orgnlFileNm || `첨부 이미지 ${index + 1}`,
          }))}
          index={viewerIndex}
          onChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}

      <section
        aria-labelledby="inquiry-answer"
        className="border-t border-line-strong pt-6 max-[760px]:pt-5"
      >
        <h3 id="inquiry-answer" className="mb-4 text-lg font-bold text-ink">
          관리자 답변
        </h3>
        {answered ? (
          <div className="rounded-[10px] bg-brand-50 px-6 py-6 max-[760px]:p-5">
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="flex size-8 items-center justify-center rounded-full bg-white text-brand-600">
                <Headset size={18} aria-hidden="true" />
              </span>
              <b className="text-base font-semibold text-ink">
                냥멍케어 고객센터
              </b>
              <i className="text-subtle not-italic" aria-hidden="true">
                ·
              </i>
              <time>{formatDateTime(inquiry.ansDt)}</time>
            </p>
            <p className="mt-4 text-base leading-[1.7] whitespace-pre-line text-ink">
              {inquiry.ansCn}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-4 rounded-[10px] border border-dashed border-line-strong px-6 py-5 text-muted max-[760px]:p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-subtle">
              <Clock size={22} aria-hidden="true" />
            </span>
            <p>
              <b className="block font-semibold text-ink">
                아직 답변이 등록되지 않았어요
              </b>
              확인 후 답변을 드리고, 등록되면 알림으로 알려 드려요.
            </p>
          </div>
        )}
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-4">
        {answered ? (
          <p className="ml-auto flex items-center gap-2 text-sm text-subtle max-[760px]:order-2 max-[760px]:ml-0 max-[760px]:w-full max-[760px]:justify-center">
            <Lock size={16} aria-hidden="true" />
            답변이 등록된 문의는 수정할 수 없어요
          </p>
        ) : (
          <div className="ml-auto flex gap-2 max-[760px]:w-full">
            <button
              type="button"
              onClick={() => setIsDeleting(true)}
              className={`${BTN_SECONDARY} ${ACTION_SIZE} cursor-pointer`}
            >
              삭제
            </button>
            <Link
              to={generatePath(PATHS.INQUIRY_EDIT, {
                otoInqrySn: inquiry.otoInqrySn,
              })}
              className={`${BTN_PRIMARY} ${ACTION_SIZE}`}
            >
              문의 수정
            </Link>
          </div>
        )}
      </div>

      {isDeleting && (
        <ConfirmModal
          title="문의를 삭제할까요? 삭제한 문의는 되돌릴 수 없어요"
          confirmLabel="삭제하기"
          isDanger
          isPending={remove.isPending}
          errorMessage={remove.error?.message}
          onConfirm={() =>
            remove.mutate(inquiry.otoInqrySn, {
              onSuccess: () => {
                showToast('문의를 삭제했어요', { type: 'success' });
                navigate(PATHS.INQUIRIES, { replace: true });
              },
            })
          }
          onCancel={() => {
            remove.reset();
            setIsDeleting(false);
          }}
        />
      )}
    </article>
  );
}
