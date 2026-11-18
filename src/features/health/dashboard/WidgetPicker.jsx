import { useState } from 'react';
import NoticeBox from '@/components/NoticeBox';
import Icon from '@/components/Icon';
import { CHIP, CHIP_ON } from '@/components/buttonStyles';
import {
  RECOMMENDED_IDS,
  WIDGET_GROUPS,
  findWidgetItem,
  joinWidgetNames,
  keepWidgetOrder,
} from './widgetItems';

/** 칩: strong이면 강조색 */
const chip = (text, strong = false) => ({ chip: text, strong });

/**
 * 미리보기 예시 값 (※신규 정책): 실제 기록·API를 쓰지 않는 고정 값. 정의가 없는 항목은 회색 줄 2개
 * - value·unit: 큰 값, sub: 큰 값 아래 회색 한 줄, chart: 'line' 꺾은선 | 'bars' 막대 5개(strongBar 번째만 진하게, 기본 마지막)
 * - rows: 한 줄씩(글자·칩 섞음, tone 'brand'면 강조색), chips: 줄바꿈되는 칩 목록, photo: 왼쪽 사진 자리
 */
const PREVIEW_SAMPLES = {
  weight: { value: '4.5', unit: 'kg', chart: 'line' },
  meal: { value: '80', unit: 'g', chart: 'bars' },
  water: { value: '300', unit: 'ml', chart: 'bars' },
  walk: { value: '30', unit: '분', chart: 'bars' },
  poop: { value: '정상', sub: '오늘 09:10', chart: 'bars', strongBar: 0 },
  ckup: {
    rows: [
      { parts: ['10.20', chip('정기검진', true)] },
      { parts: ['09.03', chip('예방접종')] },
    ],
  },
  insp: { value: '0.71', unit: 'mg/dL', sub: 'CREA · 참고범위 0.5~1.8' },
  presc: {
    rows: [
      { parts: [chip('복용 중', true), '피부 연고'] },
      { parts: [chip('복용 종료'), '소화제'] },
    ],
  },
  atch: {
    rows: [
      { parts: [chip('IMG'), '진료비 영수증.png'] },
      { parts: [chip('IMG'), '혈액검사 결과.png'] },
    ],
  },
  obsv: {
    photo: true,
    rows: [{ parts: ['배 부어오름'] }, { parts: ['1mm → 2mm'] }],
  },
  allergy: { chips: ['닭고기', '꽃가루', '슬개골 탈구'] },
  vacc: {
    rows: [
      { parts: ['최근 접종 · 11.03 종합백신'] },
      { parts: ['다음 검진 · 12.15 정기검진'] },
    ],
  },
  care: {
    rows: [
      { parts: ['양치 · 오늘 완료'], tone: 'brand' },
      { parts: ['빗질 · 오늘 미완료'] },
    ],
  },
};

/** AI 건강분석 리포트 예시 값 */
const AI_SAMPLE = {
  title: '지금 건강해요',
  sub: '배변이 정상으로 돌아왔어요 · 음수량을 꾸준히 기록해 주세요',
};

/** 막대 5개 높이 */
const BAR_HEIGHTS = ['h-3', 'h-5', 'h-3', 'h-4', 'h-6'];

/**
 * [기록 고르기] 튜토리얼 2단계·[대시보드 편집] 본문 (D4·D5·D7)
 * - 760px 이상 두 칸 (※신규 정책): 왼쪽 안내 문구 → 추천 줄 → 4묶음 칩, 오른쪽 대시보드 미리보기(모달 스크롤에도 sticky로 고정)
 * - 760px 미만은 한 칸, 미리보기 숨김
 * - 미리보기: 5:7 두 칸, 카드 3열(AI 리포트 한 줄 전체, 맨 위 고정, 끌 수 없음), 항목별 고정 예시 값(실제 기록 아님) (※신규 정책)
 * - 미리보기 카드 순서는 고른 순서(새로 켠 항목 맨 뒤). 카드를 끌어 놓아 순서를 바꾸고 그 순서로 저장 (※신규 정책, 2026-11-14)
 *   브라우저 기본 드래그만 씀. 미리보기는 760px 미만에서 숨겨 터치 끌기는 없음
 */
export default function WidgetPicker({
  petNm,
  isEdit,
  draftIds,
  lastPickedId,
  onToggle,
  onRecommend,
  onReorder,
}) {
  const orderedIds = keepWidgetOrder(draftIds);
  const [draggingId, setDraggingId] = useState(null);
  const [overId, setOverId] = useState(null);

  const endDrag = () => {
    setDraggingId(null);
    setOverId(null);
  };

  /** 끈 카드를 놓은 카드 자리로 옮김 */
  const handleDrop = (event, id) => {
    event.preventDefault();
    if (draggingId && draggingId !== id) {
      const next = orderedIds.filter((item) => item !== draggingId);
      next.splice(orderedIds.indexOf(id), 0, draggingId);
      onReorder(next);
    }
    endDrag();
  };

  return (
    <div className="grid min-w-0 items-start gap-6 min-[760px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="flex min-w-0 flex-col gap-5">
        {isEdit ? (
          <p className="text-muted">
            보여 줄 기록을 고르고, 오른쪽 미리보기에서 카드를 끌어 순서를 바꿔요
          </p>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-ink">
              {`${petNm}에게 어떤 기록을 남길까요?`}
            </h3>
            <p className="mt-1 text-muted">
              고르는 대로 대시보드 미리보기가 바로 바뀌어요
            </p>
          </div>
        )}

        <NoticeBox className="flex flex-wrap items-center gap-2 max-[760px]:flex-col max-[760px]:items-stretch">
          <span className="flex min-w-0 flex-1 items-start gap-2 min-[760px]:contents">
            <Icon name="tips_and_updates" className="shrink-0 text-subtle" />
            <span className="min-w-0 flex-1 break-keep">
              {`처음이라면 ${joinWidgetNames(RECOMMENDED_IDS)}부터 시작해 보세요`}
            </span>
          </span>
          <button
            type="button"
            className="inline-flex h-8 items-center rounded-md bg-brand-50 px-3 font-semibold whitespace-nowrap text-brand-600 hover:bg-brand-100 max-[760px]:self-end"
            onClick={() => onRecommend(RECOMMENDED_IDS)}
          >
            추천대로 고르기
          </button>
        </NoticeBox>

        {WIDGET_GROUPS.map((group) => (
          <div key={group.name}>
            <h4 className="font-semibold text-ink">
              {group.name}{' '}
              <small className="text-sm font-medium text-subtle">
                {group.sub}
              </small>
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.items.map((item) => {
                const isOn = draftIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isOn}
                    className={`${isOn ? CHIP_ON : CHIP} gap-1.5`}
                    onClick={() => onToggle(item.id)}
                  >
                    <Icon name={item.icon} className="text-lg" />
                    {item.nm}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {isEdit && (
          <p className="flex gap-2 text-sm text-muted">
            <Icon name="info" className="mt-0.5 text-subtle" />
            빼도 지금까지 남긴 기록은 지워지지 않아요. 대시보드 카드만 숨겨져요.
          </p>
        )}
      </div>

      <div className="sticky top-0 max-[760px]:hidden">
        <div className="flex flex-col gap-3 rounded-card bg-surface-2 p-4">
          <p className="text-sm">
            <b className="text-ink">대시보드 미리보기</b>
            <span className="text-subtle"> · </span>
            <span className="font-semibold text-brand-600">예시 값</span>
          </p>
          <ul className="grid grid-cols-3 gap-2">
            <PreviewCard
              icon="auto_awesome"
              name="AI 건강분석 리포트"
              className="col-span-full"
            >
              <AiSample />
            </PreviewCard>
            {orderedIds.map((id) => {
              const item = findWidgetItem(id);
              return (
                <PreviewCard
                  key={id}
                  icon={item.icon}
                  name={item.nm}
                  isNew={id === lastPickedId}
                  dragState={
                    id === draggingId
                      ? 'dragging'
                      : id === overId && draggingId !== null
                        ? 'over'
                        : null
                  }
                  dragProps={{
                    draggable: true,
                    onDragStart: (event) => {
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', id);
                      setDraggingId(id);
                    },
                    onDragOver: (event) => {
                      if (draggingId === null) return;
                      event.preventDefault();
                      setOverId(id);
                    },
                    onDrop: (event) => handleDrop(event, id),
                    onDragEnd: endDrag,
                  }}
                >
                  <PreviewSample sample={PREVIEW_SAMPLES[id]} />
                </PreviewCard>
              );
            })}
            <li className="grid min-h-18 place-items-center rounded-box border border-dashed border-line-strong px-3 py-2.5 text-center text-sm text-subtle">
              {orderedIds.length > 0
                ? '하나 더 고르면 여기에 카드가 생겨요'
                : '아래에서 고르면 여기에 카드가 생겨요'}
            </li>
          </ul>
          <p className="text-badge/[1.5] text-subtle">
            값은 예시예요. 고른 기록은 건강 대시보드에 이 모양으로 놓이고,
            카드를 끌어 순서를 바꿀 수 있어요.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 미리보기 카드 한 장: 아이콘 + 이름 + 예시 값(children). 방금 고른 카드는 진한 테두리
 * - dragProps가 있으면 끌 수 있는 카드. dragState 'dragging'은 끄는 카드, 'over'는 놓을 자리
 */
function PreviewCard({
  icon,
  name,
  isNew = false,
  dragState = null,
  dragProps = null,
  className = '',
  children,
}) {
  const frameClass =
    dragState === 'dragging'
      ? 'border-line-strong bg-surface-2'
      : dragState === 'over' || isNew
        ? 'border-brand-500 bg-white'
        : 'border-line bg-white';
  return (
    <li
      {...dragProps}
      className={`flex min-w-0 flex-col gap-2 rounded-box border px-3 py-2.5 ${frameClass} ${
        dragProps ? 'cursor-grab' : ''
      } ${className}`}
    >
      <span className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-ink">
        <Icon name={icon} className="shrink-0 text-lg text-brand-500" />
        <span className="truncate">{name}</span>
      </span>
      {children}
    </li>
  );
}

/** AI 건강분석 리포트 예시: 굵은 한 줄 + 회색 한 줄 */
function AiSample() {
  return (
    <span className="flex min-w-0 flex-col gap-0.5">
      <b className="truncate text-sm font-bold text-ink">{AI_SAMPLE.title}</b>
      <span className="truncate text-badge text-subtle">{AI_SAMPLE.sub}</span>
    </span>
  );
}

/** 항목 예시 값. sample이 없으면(새 항목) 회색 줄 2개 */
function PreviewSample({ sample }) {
  if (!sample) {
    return (
      <span aria-hidden="true" className="flex w-full flex-col gap-1.5">
        <span className="h-2 w-[90%] rounded-full bg-surface-3" />
        <span className="h-2 w-[65%] rounded-full bg-surface-3" />
      </span>
    );
  }
  if (sample.chips) {
    return (
      <span className="flex flex-wrap gap-1">
        {sample.chips.map((text) => (
          <SampleChip key={text} text={text} />
        ))}
      </span>
    );
  }
  if (sample.rows) {
    const rows = (
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        {sample.rows.map((row, index) => (
          <span
            key={index}
            className={`flex min-w-0 items-center gap-1 text-badge ${
              row.tone === 'brand' ? 'text-brand-600' : 'text-ink-2'
            }`}
          >
            {row.parts.map((part, partIndex) =>
              typeof part === 'string' ? (
                <span key={partIndex} className="min-w-0 truncate">
                  {part}
                </span>
              ) : (
                <SampleChip
                  key={partIndex}
                  text={part.chip}
                  isStrong={part.strong}
                />
              ),
            )}
          </span>
        ))}
      </span>
    );
    if (!sample.photo) return rows;
    return (
      <span className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden="true"
          className="size-9 shrink-0 rounded-box border border-line bg-surface-3"
        />
        {rows}
      </span>
    );
  }
  return (
    <span className="flex min-w-0 flex-col gap-1.5">
      <span className="flex min-w-0 items-baseline gap-1">
        <b className="truncate text-lg font-bold text-ink">{sample.value}</b>
        {sample.unit && (
          <span className="shrink-0 text-badge text-subtle">{sample.unit}</span>
        )}
      </span>
      {sample.sub && (
        <span className="truncate text-badge text-subtle">{sample.sub}</span>
      )}
      {sample.chart === 'line' && (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 24"
          preserveAspectRatio="none"
          className="h-6 w-full fill-none stroke-brand-500"
        >
          <polyline
            points="4,18 28,11 52,15 76,6 96,9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      {sample.chart === 'bars' && (
        <span aria-hidden="true" className="flex h-6 items-end gap-1">
          {BAR_HEIGHTS.map((height, index) => (
            <span
              key={index}
              className={`flex-1 rounded-sm ${height} ${
                index === (sample.strongBar ?? BAR_HEIGHTS.length - 1)
                  ? 'bg-brand-500'
                  : 'bg-brand-100'
              }`}
            />
          ))}
        </span>
      )}
    </span>
  );
}

/** 예시 칩: 기본 회색, isStrong이면 강조색 */
function SampleChip({ text, isStrong = false }) {
  return (
    <span
      className={`shrink-0 rounded-full px-1.5 text-badge font-semibold whitespace-nowrap ${
        isStrong ? 'bg-brand-50 text-brand-600' : 'bg-surface-3 text-ink-2'
      }`}
    >
      {text}
    </span>
  );
}
