import UnderlineTabs from '@/components/UnderlineTabs';

/** 탭 id `char-<own|shared>`. 탭 패널은 이 id, 탭 버튼은 `${id}-tab`(UnderlineTabs). CharacterPage가 같은 이름으로 패널을 단다 */
const CHAR_TAB_IDS = { own: 'char-own', shared: 'char-shared' };

/**
 * [내 캐릭터 · 공동양육 탭] 공용 밑줄 탭(UI 체크리스트 69)
 * - 공동양육 동물이 없으면 호출하는 쪽에서 이 탭을 그리지 않는다 (FN-MYP-010-01)
 */
export default function CharacterTabs({ selectedKey, sharedCount, onSelect }) {
  const items = [
    { id: CHAR_TAB_IDS.own, label: '내 캐릭터' },
    {
      id: CHAR_TAB_IDS.shared,
      label: (
        <span className="inline-flex items-center gap-1.5">
          공동양육
          <span className="font-semibold text-subtle tabular-nums">
            ({sharedCount})
          </span>
        </span>
      ),
    },
  ];

  return (
    <UnderlineTabs
      items={items}
      activeId={CHAR_TAB_IDS[selectedKey]}
      onSelect={(id) => onSelect(id === CHAR_TAB_IDS.shared ? 'shared' : 'own')}
      label="캐릭터 구분"
      isScrollable
    />
  );
}
