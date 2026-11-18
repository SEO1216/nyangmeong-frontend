import Badge from '@/components/Badge';
import { INQUIRY_STATUS } from './api';

/** 처리 상태 뱃지: 미답변(amber), 답변 완료(green) */
export default function InquiryStatusBadge({ isAnswered }) {
  return (
    <Badge tone={isAnswered ? 'green' : 'amber'}>
      {isAnswered ? INQUIRY_STATUS.DONE : INQUIRY_STATUS.OPEN}
    </Badge>
  );
}
