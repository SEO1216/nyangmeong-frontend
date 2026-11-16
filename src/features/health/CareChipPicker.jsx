import Icon from '@/components/Icon';
import { CARE_ZONE, isCustomCareItem, isLinkedCareItem } from './careDue';
import { toCareIcon } from './careIcons';

const ZONES = [
  { cd: CARE_ZONE.REGULAR, nm: '정기관리' },
  { cd: CARE_ZONE.DAILY, nm: '일상관리' },
];

const CHIP_ON = 'border-brand-500 bg-brand-50 text-brand-600';
const CHIP_OFF =
  'border-line bg-white text-muted hover:border-line-strong hover:text-ink';
const HINT_CLASS = 'text-sm text-subtle';

/** 칩 식별값: 저장 전 새 항목은 chipKey, 나머지는 항목 번호 */
const getChipKey = (item) => item.chipKey ?? item.careArtclSn;

/**
 * [케어 고르기 칩] (※신규 정책)
 * - 튜토리얼 3단계와 「케어 항목 관리」 모달 왼쪽이 같이 사용
 * - 처방·반복 예방 연동 항목은 켜진 상태로 고정 + 「항상 표시」 핀
 * - onEdit·onDelete를 주면 직접 만든 항목 칩에만 ✎·✕
 */
export default function CareChipPicker({
  items,
  isOn,
  onToggle,
  onEdit = null,
  onDelete = null,
  editingKey = null,
}) {
  const hasLinked = items.some(isLinkedCareItem);
  const hasActions = onEdit != null && onDelete != null;

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
                    onToggle={onToggle}
                    onEdit={hasActions ? onEdit : null}
                    onDelete={hasActions ? onDelete : null}
                  />
                ))}
              </ul>
            )}
          </div>
        );
      })}
      {(hasLinked || hasActions) && (
        <div className="flex flex-col gap-1">
          {hasLinked && (
            <p className={HINT_CLASS}>
              복용 중인 약과 반복 예방은 항상 표시돼요. 처방이 끝나거나 검진상세
              [반복 예방]에서 해지하면 자동으로 빠져요
            </p>
          )}
          {hasActions && (
            <p className={HINT_CLASS}>
              직접 만든 항목만 ✎ 수정 · ✕ 삭제가 보여요
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** 칩 하나: 켠 칩은 청록 + 체크, 끈 칩은 회색 + 더하기 */
function CareChip({ item, isOn, isEditing, onToggle, onEdit, onDelete }) {
  const isLinked = isLinkedCareItem(item);
  const hasActions = onEdit != null && isCustomCareItem(item);
  const frameClass = `${isOn ? CHIP_ON : CHIP_OFF} ${isEditing ? 'ring-2 ring-brand-500/30' : ''}`;

  if (isLinked) {
    return (
      <li
        className={`inline-flex h-9 max-w-full items-center gap-1.5 rounded-full border px-3.5 ${CHIP_ON}`}
      >
        <Icon name="check" className="text-lg" />
        <Icon name={toCareIcon(item.rprsIconId)} className="text-lg" />
        <span className="truncate">{item.careArtclNm}</span>
        <span
          role="img"
          title="항상 표시"
          aria-label="항상 표시"
          className="inline-flex shrink-0"
        >
          <Icon name="push_pin" className="text-lg text-subtle" />
        </span>
      </li>
    );
  }

  return (
    <li
      className={`inline-flex h-9 max-w-full items-center rounded-full border ${frameClass}`}
    >
      <button
        type="button"
        aria-pressed={isOn}
        className={`inline-flex h-full min-w-0 items-center gap-1.5 rounded-full pl-3.5 ${hasActions ? 'pr-2' : 'pr-3.5'}`}
        onClick={() => onToggle(item)}
      >
        <Icon name={isOn ? 'check' : 'add'} className="text-lg" />
        <Icon name={toCareIcon(item.rprsIconId)} className="text-lg" />
        <span className="truncate">{item.careArtclNm}</span>
      </button>
      {hasActions && (
        <span className="mr-1.5 flex shrink-0 items-center border-l border-current/25 pl-1">
          <button
            type="button"
            aria-label={`${item.careArtclNm} 수정`}
            className="grid size-7 place-items-center rounded-full hover:bg-surface-3"
            onClick={() => onEdit(item)}
          >
            <Icon name="edit" className="text-base" />
          </button>
          <button
            type="button"
            aria-label={`${item.careArtclNm} 삭제`}
            className="grid size-7 place-items-center rounded-full hover:bg-surface-3"
            onClick={() => onDelete(item)}
          >
            <Icon name="close" className="text-base" />
          </button>
        </span>
      )}
    </li>
  );
}
