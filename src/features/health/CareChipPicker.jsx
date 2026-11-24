import Icon from '@/components/Icon';
import { CHIP, CHIP_ON } from '@/components/buttonStyles';
import { CARE_ZONE, isLinkedCareItem } from './careDue';
import { toCareIcon } from './careIcons';

const ZONES = [
  { cd: CARE_ZONE.REGULAR, nm: '정기관리' },
  { cd: CARE_ZONE.DAILY, nm: '일상관리' },
];

const HINT_CLASS = 'text-sm text-subtle';

/** 칩 식별값: 저장 전 새 항목은 chipKey, 나머지는 항목 번호 */
const getChipKey = (item) => item.chipKey ?? item.careArtclSn;

/** 수정 상태에서 누를 수 없는 칩의 이유. 누를 수 있으면 null (연동 항목은 눌러서 검진상세 이동 안내를 띄움) */
const getLockReason = (item) => {
  if (item.bscArtclYn && item.careZoneCd !== CARE_ZONE.REGULAR)
    return '기본 일상관리는 고칠 내용이 없어요';
  return null;
};

/**
 * [케어 고르기 칩] (※신규 정책)
 * - 튜토리얼 3단계와 「케어 항목 관리」 모달 왼쪽이 같이 사용
 * - 처방·반복 예방 연동 항목은 켜진 상태로 고정 + 「항상 표시」 핀
 * - isEditMode(모달의 「수정」 상태): 칩을 눌러도 켜고 끄지 않고 onEdit. 고칠 수 없는 칩은 흐리게 + 이유. 연동 칩도 눌러 오른쪽에 검진상세 이동 안내를 띄움
 */
export default function CareChipPicker({
  items,
  isOn,
  onToggle,
  isEditMode = false,
  onEdit = null,
  editingKey = null,
}) {
  const hasLinked = items.some(isLinkedCareItem);

  return (
    <div className="flex flex-col gap-4">
      {ZONES.map((zone) => {
        const zoneItems = items.filter((item) => item.careZoneCd === zone.cd);
        return (
          <div key={zone.cd}>
            <h4 className="font-semibold text-ink">
              {zone.nm}{' '}
              <small className="text-sm font-medium text-subtle">
                {zoneItems.length}개
              </small>
            </h4>
            {zoneItems.length === 0 ? (
              <p className={`mt-2 ${HINT_CLASS}`}>항목이 없어요</p>
            ) : (
              <ul className="mt-2 flex flex-wrap gap-2">
                {zoneItems.map((item) => (
                  <CareChip
                    key={getChipKey(item)}
                    item={item}
                    isOn={isLinkedCareItem(item) || isOn(item)}
                    isEditing={editingKey === getChipKey(item)}
                    isEditMode={isEditMode}
                    onToggle={onToggle}
                    onEdit={onEdit}
                  />
                ))}
              </ul>
            )}
          </div>
        );
      })}
      {(hasLinked || isEditMode) && (
        <div className="flex flex-col gap-1">
          {isEditMode && <p className={HINT_CLASS}>고칠 항목을 눌러 주세요</p>}
          {hasLinked && (
            <p className={HINT_CLASS}>
              복용 중인 약과 반복 예방은 항상 표시돼요. 처방이 끝나거나 검진상세
              [반복 예방]에서 해지하면 자동으로 빠져요
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** 칩 하나: 켠 칩은 청록 + 체크, 끈 칩은 회색 + 더하기. 수정 상태에서는 칩 전체가 「이 항목 수정」 버튼 */
function CareChip({ item, isOn, isEditing, isEditMode, onToggle, onEdit }) {
  const isLinked = isLinkedCareItem(item);

  if (isEditMode) {
    const lockReason = getLockReason(item);
    return (
      <li
        title={lockReason ?? undefined}
        className={`inline-flex h-9 max-w-full ${lockReason ? 'opacity-50' : ''}`}
      >
        <button
          type="button"
          aria-pressed={isEditing}
          aria-label={`${item.careArtclNm} 수정`}
          aria-description={lockReason ?? undefined}
          disabled={lockReason != null}
          className={`${isOn ? CHIP_ON : CHIP} h-full min-w-0 gap-1.5 disabled:pointer-events-none ${
            isEditing ? 'ring-2 ring-brand-500 ring-offset-2' : ''
          }`}
          onClick={() => onEdit(item)}
        >
          <Icon name={isOn ? 'check' : 'add'} className="text-lg" />
          <Icon name={toCareIcon(item.rprsIconId)} className="text-lg" />
          <span className="truncate">{item.careArtclNm}</span>
          {isLinked && <Icon name="push_pin" className="text-lg" />}
        </button>
      </li>
    );
  }

  if (isLinked) {
    return (
      <li className={`${CHIP_ON} max-w-full gap-1.5`}>
        <Icon name="check" className="text-lg" />
        <Icon name={toCareIcon(item.rprsIconId)} className="text-lg" />
        <span className="truncate">{item.careArtclNm}</span>
        <span
          role="img"
          title="항상 표시"
          aria-label="항상 표시"
          className="inline-flex shrink-0"
        >
          <Icon name="push_pin" className="text-lg" />
        </span>
      </li>
    );
  }

  return (
    <li className={`${isOn ? CHIP_ON : CHIP} max-w-full px-0`}>
      <button
        type="button"
        aria-pressed={isOn}
        className="inline-flex h-full min-w-0 items-center gap-1.5 rounded-full px-3.5"
        onClick={() => onToggle(item)}
      >
        <Icon name={isOn ? 'check' : 'add'} className="text-lg" />
        <Icon name={toCareIcon(item.rprsIconId)} className="text-lg" />
        <span className="truncate">{item.careArtclNm}</span>
      </button>
    </li>
  );
}
