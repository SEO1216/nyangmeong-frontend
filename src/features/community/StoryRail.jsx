import { ChevronRight, Heart, MessageCircleHeart } from 'lucide-react';
import { generatePath, Link } from 'react-router-dom';
import FileImage from '@/components/FileImage';
import { PATHS } from '@/routes/paths';
import { publicFileUrl } from '@/utils/fileUrl';
import ImagePlaceholder from './ImagePlaceholder';
import { useHealthTips, usePopularPhoto, useTodayStory } from './queries';

const CARD_CLASS =
  'rounded-[14px] border border-line bg-white px-5 py-5 max-[1100px]:mt-10 max-[760px]:[&+section]:mt-4';

/** 접힌 모서리: 1px 칸 24×24개를 계단으로 자르고(clipPath), 접힌 면과 선을 같은 칸으로 그린다 */
const CELL = 1;
const STEPS = 24;
const NOTCH = CELL * STEPS;
const FOLD_CLIP = `polygon(0 0, ${Array.from(
  { length: STEPS },
  (_, index) => index,
)
  .map((row) => {
    const x = `calc(100% - ${NOTCH - CELL * (row + 1)}px)`;
    return `${x} ${CELL * row}px, ${x} ${CELL * (row + 1)}px`;
  })
  .join(', ')}, 100% 100%, 0 100%)`;

/** 칸 (row, col): 대각선·왼쪽·아래는 선(brand-100), 그 안쪽은 접힌 면(white). 대각선 위쪽은 잘려 나간 칸 */
function FoldCorner() {
  const cells = [];
  for (let row = 0; row < STEPS; row += 1) {
    for (let col = 0; col <= row; col += 1) {
      const isLine = col === row || col === 0 || row === STEPS - 1;
      cells.push(
        <rect
          key={`${row}-${col}`}
          x={col}
          y={row}
          width="1"
          height="1"
          className={isLine ? 'fill-brand-100' : 'fill-white'}
        />,
      );
    }
  }
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${STEPS} ${STEPS}`}
      shapeRendering="crispEdges"
      style={{ width: NOTCH, height: NOTCH }}
      className="absolute -top-px -right-px"
    >
      {cells}
    </svg>
  );
}

const detailPath = (pstSn) =>
  generatePath(PATHS.COMMUNITY_POST_DETAIL, { pstSn });

/** 오른쪽 레일: 오늘의 한마디 · 인기 포토 · 오늘의 건강 이야기 (1100px 이하는 목록 아래) */
export default function StoryRail({ action }) {
  const { data: story } = useTodayStory();
  const { data: photo } = usePopularPhoto();
  const { data: tips } = useHealthTips();

  return (
    <aside
      aria-label="오늘의 콘텐츠"
      className="flex min-w-0 flex-col gap-4 max-[1100px]:contents"
    >
      {action && (
        <div className="max-[1100px]:order-first max-[1100px]:col-span-full">
          {action}
        </div>
      )}
      {story && (
        <div
          style={{ clipPath: FOLD_CLIP }}
          className="relative rounded-md border border-brand-100 bg-brand-50 px-5 py-4 max-[1100px]:order-first max-[1100px]:col-span-full max-[1100px]:mb-6"
        >
          <FoldCorner />
          <p className="flex items-center gap-2 text-sm font-medium text-brand-500">
            <MessageCircleHeart size={16} aria-hidden="true" />
            오늘의 한마디
          </p>
          <q className="mt-2 block text-base leading-[1.6] font-medium text-ink [quotes:none]">
            “{story.cmtryCn}”
          </q>
        </div>
      )}

      {photo?.imgs.length > 0 && (
        <section
          aria-labelledby="post-photo-title"
          className="relative overflow-hidden rounded-[14px] bg-surface-2 max-[1100px]:mt-10 max-[760px]:[&+section]:mt-4"
        >
          <Link to={detailPath(photo.pstSn)} className="group block">
            <FileImage
              src={publicFileUrl(photo.imgs[0].atchFileSn)}
              className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              fallback={<ImagePlaceholder className="aspect-square w-full" />}
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/55 via-black/25 to-transparent"
            />
            <h2
              id="post-photo-title"
              className="absolute top-3 left-3 inline-flex h-6 items-center rounded-full bg-black/40 px-3 pt-[1.5px] text-badge leading-none font-semibold text-white backdrop-blur-sm"
            >
              인기 포토
            </h2>
            <span className="absolute inset-x-0 bottom-0 px-4 pb-4 text-white">
              <span className="block truncate text-base font-semibold">
                {photo.pstTtl}
              </span>
              <span className="mt-1 flex items-center justify-between text-sm text-white">
                <span className="truncate">{photo.mbrNcnm}</span>
                <span className="inline-flex shrink-0 items-center gap-1">
                  <Heart size={14} aria-hidden="true" />
                  <span className="sr-only">좋아요</span>
                  {photo.rcmdtnCnt}
                </span>
              </span>
            </span>
          </Link>
        </section>
      )}

      <section aria-labelledby="post-tip-title" className={CARD_CLASS}>
        <h2
          id="post-tip-title"
          className="text-lg font-bold tracking-[-0.01em] text-ink"
        >
          오늘의 건강 이야기
        </h2>
        <ul className="mt-2">
          {tips?.map((tip) => (
            <li
              key={tip.pstSn}
              className="border-t border-line first:border-t-0"
            >
              <Link to={detailPath(tip.pstSn)} className="group block py-3">
                <span className="block truncate text-base font-semibold text-ink group-hover:text-brand-500">
                  {tip.pstTtl}
                </span>
                <span className="mt-1 line-clamp-2 text-sm leading-normal text-muted">
                  {tip.pstCn.split('\n')[0]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to={PATHS.HEALTH}
          className="mt-3 flex h-10 items-center justify-center gap-1 rounded-md bg-brand-50 text-base font-semibold text-brand-600 hover:bg-brand-100"
        >
          내 펫 건강 체크하기
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </aside>
  );
}
