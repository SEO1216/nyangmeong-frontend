import { TriangleAlert } from 'lucide-react';
import { MIN_CARE_COUNT } from './careDue';
import { useCareItems } from './queries';

/** 주의 상자: 가계부 일괄 삭제 확인창과 같은 모양 */
export function CareWarnBox({ className = '', children }) {
  return (
    <p
      className={`flex items-start gap-2 rounded-box border border-warn-line bg-warn-soft px-4 py-3 text-left text-sm text-warn ${className}`}
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span className="break-keep">{children}</span>
    </p>
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
