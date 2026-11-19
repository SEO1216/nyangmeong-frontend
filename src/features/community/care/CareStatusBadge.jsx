import Badge from '@/components/Badge';
import { RCRT_STTS, getRcrtSttsLabel } from '../careCodes';

const TONES = {
  [RCRT_STTS.OPEN]: 'ok',
  [RCRT_STTS.MATCHED]: 'blue',
  [RCRT_STTS.DONE]: 'gray',
};

/** 모집중(초록 점) · 매칭완료(파랑) · 거래완료·모집 종료(회색) 상태 배지. 색이 있는 상태만 글자색 알파 0.1의 안쪽 테두리 */
export default function CareStatusBadge({ post, className = '' }) {
  const tone = TONES[post.rcrtSttsCd];
  return (
    <Badge tone={tone} bordered={tone !== 'gray'} className={className}>
      {getRcrtSttsLabel(post)}
    </Badge>
  );
}
