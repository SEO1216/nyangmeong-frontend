import { PawPrint } from 'lucide-react';
import { useState } from 'react';
import LoadError from '@/components/LoadError';
import Card from '@/components/Card';
import Icon from '@/components/Icon';
import SkeletonCard from '@/components/SkeletonCard';
import { BTN_SECONDARY } from '@/components/buttonStyles';
import { getTodayYmd } from '@/utils/formatDate';
import CareManageModal from './CareManageModal';
import CareProgressBox from './CareProgressBox';
import CareRecordList from './CareRecordList';
import CareTile from './CareTile';
import { CARE_ZONE, MIN_CARE_COUNT } from './careDue';
import UnderlineTabs from '@/components/UnderlineTabs';
import {
  useCancelCareRecord,
  useCancelLastDose,
  useCareItems,
  useCheckCareItem,
} from './queries';

/** 760px 미만에서 구역마다 처음 보여 주는 칸 수 */
const MOBILE_VISIBLE_COUNT = 3;

/** 1100px 이하에서 두 구역을 전환하는 탭 */
const ZONE_TABS = [
  { id: 'hlt003-care-today', label: '오늘 할 케어' },
  { id: 'hlt003-care-upcoming', label: '다가오는 정기관리' },
];
const EMPTY_TEXTS = {
  'hlt003-care-today': '오늘 할 케어가 없어요',
  'hlt003-care-upcoming': '다가오는 정기관리가 없어요',
};

/**
 * [케어리스트 탭] (FN-HLT-003-12, ※신규 정책)
 * - 「케어리스트」 카드(진행 상자 + 오늘 할 케어·다가오는 정기관리) 아래 「최근 케어 기록」 카드
 * - 케어리스트에는 고른 항목(indctYn)만. 5개 미만이면 「케어 항목 관리」 모달이 자동으로 열림
 * - mission: 오늘 케어미션 요약(페이지가 조립). undefined는 불러오는 중, null은 없음
 */
export default function CareList({ petSn, petNm, mission }) {
  const { data, isPending, isError, error, refetch } = useCareItems(petSn);
  const [isManaging, setIsManaging] = useState(false);
  const [zoneId, setZoneId] = useState(ZONE_TABS[0].id);
  /** 760px 미만에서 펼친 구역: 반려동물별 키라 반려동물을 바꾸면 다시 접힘 */
  const [expandedZones, setExpandedZones] = useState([]);
  const checkCareItem = useCheckCareItem();
  const cancelLastDose = useCancelLastDose();
  const cancelCareRecord = useCancelCareRecord();

  if (isPending || (!isError && mission === undefined)) {
    return (
      <div aria-busy="true" className="flex flex-col gap-5">
        {/** 불러온 뒤 두 카드의 높이 */}
        <SkeletonCard className="h-[633px] max-[1100px]:h-[697px] max-[760px]:h-[829px]" />
        <SkeletonCard className="h-[291px] max-[760px]:h-[463px]" />
      </div>
    );
  }
  if (isError) {
    return <LoadError message={error.message} onRetry={() => refetch()} />;
  }

  const { careItems, careRecords } = data;
  const todayYmd = getTodayYmd();
  const shownItems = careItems.filter((item) => item.indctYn);
  const regularSns = new Set(
    careItems
      .filter((item) => item.careZoneCd === CARE_ZONE.REGULAR)
      .map((item) => item.careArtclSn),
  );

  const findTodayRecord = (item) =>
    careRecords.find(
      (record) =>
        record.careArtclSn === item.careArtclSn && record.cmptnYmd === todayYmd,
    );
  /** 투약 항목은 하루 복용 횟수를 채워야 완료, 나머지는 오늘 완료 기록이 있으면 완료 */
  const isDoneToday = (item) =>
    item.prscSn != null
      ? item.todayCmptnCnt >= item.dayMdcnNmtm
      : findTodayRecord(item) != null;
  const doneCount = shownItems.filter(isDoneToday).length;

  /** 오늘 할 케어: 일상관리 전부 + 예정일이 오늘인 정기관리. 완료한 항목은 맨 아래 */
  const isTodayItem = (item) =>
    item.careZoneCd !== CARE_ZONE.REGULAR ||
    (item.nxtmPrnmntYmd === todayYmd && !isDoneToday(item));
  /**
   * 구역 안 묶음 (※신규 정책)
   * - 위: 오늘의 미션 항목(todayMsnYn), 아래: 나머지
   * - 오늘 할 케어(isDoneLast): 체크한 항목은 자기 묶음 안에서 맨 아래(묶음을 넘어가지 않음). 풀면 묶음 안 원래 자리
   * - 다가오는 정기관리: 묶음 안 전체가 예정일 순. 오늘 완료한 항목도 새 다음 예정일 자리에 그대로
   */
  const toGroups = (items, isDoneLast) => {
    const sinkDone = (list) =>
      isDoneLast
        ? [
            ...list.filter((item) => !isDoneToday(item)),
            ...list.filter(isDoneToday),
          ]
        : list;
    return {
      missionItems: sinkDone(items.filter((item) => item.todayMsnYn)),
      restItems: sinkDone(items.filter((item) => !item.todayMsnYn)),
    };
  };
  const zones = {
    'hlt003-care-today': toGroups(shownItems.filter(isTodayItem), true),
    /** 다가오는 정기관리: 예정일이 지났거나 아직 안 온 것 + 오늘 완료한 것(다음 예정일 기준), 예정일 빠른 순 */
    'hlt003-care-upcoming': toGroups(
      shownItems
        .filter((item) => !isTodayItem(item))
        .sort((a, b) =>
          (a.nxtmPrnmntYmd ?? '9').localeCompare(b.nxtmPrnmntYmd ?? '9'),
        ),
      false,
    ),
  };

  /** 줄 클릭: 완료 전이면 체크, 완료한 항목은 오늘 기록 취소. 투약은 횟수를 채운 뒤에는 동작 없음 */
  const handleCheck = (item) => {
    if (item.prscSn != null) {
      if (!isDoneToday(item))
        checkCareItem.mutate({ petSn, careArtclSn: item.careArtclSn });
      return;
    }
    const todayRecord = findTodayRecord(item);
    if (todayRecord)
      cancelCareRecord.mutate({
        petSn,
        careCmptnHstrySn: todayRecord.careCmptnHstrySn,
      });
    else checkCareItem.mutate({ petSn, careArtclSn: item.careArtclSn });
  };

  const closeManage = () => {
    setIsManaging(false);
    refetch();
  };

  const isShort = shownItems.length < MIN_CARE_COUNT;

  return (
    <div className="flex flex-col gap-5">
      <Card
        title="케어리스트"
        action={
          <button
            type="button"
            className={`${BTN_SECONDARY} gap-1.5`}
            onClick={() => setIsManaging(true)}
          >
            <Icon name="tune" className="text-lg" />
            항목 관리
          </button>
        }
      >
        <CareProgressBox
          doneCount={doneCount}
          totalCount={shownItems.length}
          mission={mission}
        />

        <UnderlineTabs
          items={ZONE_TABS}
          activeId={zoneId}
          onSelect={setZoneId}
          label="케어리스트 구역"
          className="mt-4 min-[1100px]:hidden"
        />

        <div className="mt-5 grid gap-x-8 min-[1100px]:grid-cols-2">
          {ZONE_TABS.map((zone) => {
            const { missionItems, restItems } = zones[zone.id];
            const items = [...missionItems, ...restItems];
            const zoneKey = `${petSn}:${zone.id}`;
            const isExpanded = expandedZones.includes(zoneKey);
            const hiddenCount = items.length - MOBILE_VISIBLE_COUNT;
            return (
              <section
                key={zone.id}
                id={zone.id}
                aria-labelledby={`${zone.id}-title`}
                className={`min-w-0 ${zone.id === zoneId ? '' : 'max-[1100px]:hidden'}`}
              >
                <h3
                  id={`${zone.id}-title`}
                  className="flex items-baseline justify-between gap-2 border-b-2 border-line-strong pb-2 font-bold text-ink"
                >
                  {zone.label}
                  <small className="text-sm font-medium text-muted tabular-nums">
                    {items.length}개
                  </small>
                </h3>
                {items.length === 0 ? (
                  <p className="py-4 text-sm text-subtle">
                    {EMPTY_TEXTS[zone.id]}
                  </p>
                ) : (
                  <div className="grid gap-y-2 pt-3 min-[760px]:gap-y-0 min-[760px]:pt-0">
                    {/** 묶음 제목: 미션 항목이 있는 구역에만. 760px 미만 처음 3칸에는 세지 않음 */}
                    {missionItems.length > 0 && (
                      <p className="flex items-center gap-1.5 py-2 text-sm font-semibold text-warn tabular-nums">
                        <PawPrint className="size-3.5" aria-hidden="true" />
                        오늘의 미션 · {missionItems.length}개
                      </p>
                    )}
                    {items.map((item, index) => (
                      <CareTile
                        key={item.careArtclSn}
                        item={item}
                        isDone={isDoneToday(item)}
                        isMission={index < missionItems.length}
                        className={
                          !isExpanded && index >= MOBILE_VISIBLE_COUNT
                            ? 'max-[760px]:hidden'
                            : ''
                        }
                        onCheck={handleCheck}
                        onCancelLastDose={(target) =>
                          cancelLastDose.mutate({
                            petSn,
                            careArtclSn: target.careArtclSn,
                          })
                        }
                      />
                    ))}
                  </div>
                )}
                {hiddenCount > 0 && (
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    className="mt-2 flex h-10 w-full items-center justify-center gap-1 rounded-[10px] border border-line bg-white text-sm font-semibold text-ink-2 hover:bg-surface-2 min-[760px]:hidden"
                    onClick={() =>
                      setExpandedZones((prev) =>
                        isExpanded
                          ? prev.filter((key) => key !== zoneKey)
                          : [...prev, zoneKey],
                      )
                    }
                  >
                    {isExpanded ? '접기' : `더보기 (+${hiddenCount})`}
                    <Icon
                      name={isExpanded ? 'expand_less' : 'expand_more'}
                      className="text-lg"
                    />
                  </button>
                )}
              </section>
            );
          })}
        </div>
      </Card>

      <CareRecordList
        key={petSn}
        records={careRecords}
        regularSns={regularSns}
        onCancel={(record) =>
          cancelCareRecord.mutate({
            petSn,
            careCmptnHstrySn: record.careCmptnHstrySn,
          })
        }
      />

      {(isManaging || isShort) && (
        <CareManageModal
          key={`manage-${petSn}`}
          petSn={petSn}
          petNm={petNm}
          careItems={careItems}
          isForced={isShort && !isManaging}
          onClose={closeManage}
        />
      )}
    </div>
  );
}
