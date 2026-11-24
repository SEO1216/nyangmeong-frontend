import { TriangleAlert } from 'lucide-react';
import NoticeBox from '@/components/NoticeBox';
import { MIN_CARE_COUNT } from './careDue';
import { useCareItems } from './queries';

/** 주의 상자: 공용 NoticeBox(warn)에 경고 아이콘 */
export function CareWarnBox({ className = '', children }) {
  return (
    <NoticeBox
      tone="warn"
      className={`flex items-start gap-2 text-left ${className}`}
    >
      <TriangleAlert className="mt-1 size-4 shrink-0" aria-hidden="true" />
      <span className="break-keep">{children}</span>
    </NoticeBox>
  );
}

/**
 * [케어리스트 5개 미만 안내] (※신규 정책)
 * - 삭제·해지 확인창 안에 놓음. 지우면 보이는 항목이 5개 미만이 될 때만 표시
 * - isTarget: 지울 대상과 연결된 케어 항목 판별. verb: 「삭제하면」·「해지하면」
 */
export default function CareShortageNotice({
  petSn,
  isTarget,
  verb = '삭제하면',
}) {
  const { data } = useCareItems(petSn);
  if (!data) return null;

  const shownItems = data.careItems.filter((item) => item.indctYn);
  const targetCount = shownItems.filter(isTarget).length;
  const restCount = shownItems.length - targetCount;
  if (targetCount === 0 || restCount >= MIN_CARE_COUNT) return null;

  return (
    <CareWarnBox className="mt-4">
      {verb} 케어리스트가 {restCount}개가 돼요. 케어리스트에 들어가면 [항목
      관리]에서 케어를 추가할 수 있어요.
    </CareWarnBox>
  );
}
