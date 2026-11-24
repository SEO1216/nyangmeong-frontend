import Badge from '@/components/Badge';
import { isExpired, isFound } from '../missingCodes';

const TONES = { found: 'green', expired: 'gray', lost: 'rose' };

const LABELS = { found: '찾았어요', expired: '기간 만료', lost: '실종' };

/** 실종(빨강) · 찾았어요(초록) · 기간 만료(회색) 상태 배지. 색이 있는 상태만 글자색 알파 0.1의 안쪽 테두리 */
export default function MissingStatusBadge({ post, className = '' }) {
  let state = 'lost';
  if (isFound(post)) state = 'found';
  else if (isExpired(post)) state = 'expired';
  return (
    <Badge
      tone={TONES[state]}
      bordered={state !== 'expired'}
      className={className}
    >
      {LABELS[state]}
    </Badge>
  );
}
