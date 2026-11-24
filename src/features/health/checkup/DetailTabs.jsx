import UnderlineTabs from '@/components/UnderlineTabs';
import { DETAIL_TABS, getPanelId } from './checkupTypes';

/**
 * [검진상세 탭] 공용 밑줄 탭(UnderlineTabs)에 검진상세 탭과 건수를 넣는다
 * - 검사 결과 · 첨부 자료 · 처방·투약 · 반복 예방 (FN-HLT-005-15)
 * - 탭 이름 뒤에 건수를 회색 괄호로 표시하고 0건인 탭도 숨기지 않음
 * - 탭 패널 id는 getPanelId(key), 탭 버튼 id는 getTabId(key)(= 패널 id + '-tab')
 */
export default function DetailTabs({ selectedKey, counts, onSelect }) {
  return (
    <UnderlineTabs
      label="검진상세"
      isScrollable
      items={DETAIL_TABS.map((tab) => ({
        id: getPanelId(tab.key),
        label: (
          <>
            {tab.nm}
            <span className="ml-1.5 font-semibold text-subtle tabular-nums">
              ({counts[tab.key]})
            </span>
          </>
        ),
      }))}
      activeId={getPanelId(selectedKey)}
      onSelect={(id) =>
        onSelect(DETAIL_TABS.find((tab) => getPanelId(tab.key) === id).key)
      }
    />
  );
}
