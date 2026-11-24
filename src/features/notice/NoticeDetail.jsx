import { Megaphone } from 'lucide-react';
import { generatePath, Link } from 'react-router-dom';
import PostBody from '@/components/PostBody';
import { PATHS } from '@/routes/paths';
import { formatDate } from '@/utils/formatDate';
import { useNotices } from './queries';

const LATEST_SIZE = 5;

export default function NoticeDetail({ notice }) {
  const { data: latest } = useNotices({
    page: 1,
    size: LATEST_SIZE,
    latestYn: true,
  });

  return (
    <div className="flex flex-col gap-4">
      <article className="rounded-[14px] border border-line bg-white px-9 pt-8 pb-10 max-[760px]:px-5 max-[760px]:pt-6 max-[760px]:pb-8">
        <h2 className="text-2xl leading-[1.35] font-bold tracking-[-0.01em] text-ink max-[760px]:text-lg">
          {notice.ntcMttrTtl}
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-line pb-6">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-50 text-brand-500">
            <Megaphone size={18} />
          </span>
          <b className="text-base leading-normal font-medium text-ink">
            관리자
          </b>
          <i className="text-sm text-line-strong not-italic">·</i>
          <time className="text-sm text-subtle">
            {formatDate(notice.regDt)}
          </time>
        </div>

        <PostBody content={notice.ntcMttrCn} fileImages />
      </article>

      {/** 최신 목록은 박스 없이 목록만(펫뉴스 상세의 최신 기사와 같은 모양) */}
      <section className="mt-4">
        <h3 className="pb-3 text-lg leading-[1.4] font-bold tracking-[-0.01em] text-ink">
          최신 공지
        </h3>
        <ul>
          {latest?.content.map((item) => (
            <li
              key={item.ntcMttrSn}
              className="border-t border-line first:border-t-0"
            >
              <Link
                to={generatePath(PATHS.NOTICE_DETAIL, {
                  ntcMttrSn: item.ntcMttrSn,
                })}
                className="group flex items-center justify-between gap-4 py-3"
              >
                <span className="truncate text-base leading-[1.6] text-ink-2 group-hover:text-brand-500">
                  {item.ntcMttrTtl}
                </span>
                <span className="shrink-0 text-sm text-subtle">
                  {formatDate(item.regDt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
