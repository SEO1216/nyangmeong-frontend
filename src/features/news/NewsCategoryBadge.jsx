import Badge from '@/components/Badge';
import { getCategoryName, NEWS_SRC_ADMIN } from './newsCodes';

const CATEGORY_TONES = {
  건강: 'green',
  생활: 'amber',
  정책: 'blue',
  여행: 'violet',
};

/** 카테고리 배지 + 관리자 등록 뉴스면 「관리자 등록」 배지 */
export default function NewsCategoryBadge({ news }) {
  const name = getCategoryName(news.newsClsfCd);
  return (
    <div className="flex flex-wrap gap-2">
      {name && (
        <Badge tone={CATEGORY_TONES[name]} bordered>
          {name}
        </Badge>
      )}
      {news.newsSrcCd === NEWS_SRC_ADMIN && (
        <Badge tone="brand" bordered>
          관리자 등록
        </Badge>
      )}
    </div>
  );
}
