import { Link } from 'react-router-dom';
import { BTN_PRIMARY } from '@/components/buttonStyles';
import { PATHS } from '@/routes/paths';

/** 없는 주소: 헤더는 레이아웃이 그리고, 본문에 안내와 [메인으로] */
export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-center gap-6 px-4 py-30 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-page font-bold text-ink">
          페이지를 찾을 수 없어요
        </h1>
        <p className="text-base text-muted">
          주소가 바뀌었거나 없는 페이지예요
        </p>
      </div>
      <Link to={PATHS.MAIN} className={BTN_PRIMARY}>
        메인으로
      </Link>
    </section>
  );
}
