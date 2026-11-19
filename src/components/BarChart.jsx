import useElementWidth from '@/hooks/useElementWidth';

const PAD = { left: 8, top: 32, bottom: 34 };
/** 막대 높이 기준 최소 상한 */
const MIN_MAX_VALUE = 60;
/** 기본 높이(대시보드 카드·관리자 통계는 이 값) */
const HEIGHT = 122;

/** 소수 둘째 자리 반올림(부동소수 오차 없이) */
const round2 = (value) => {
  const sign = value < 0 ? -1 : 1;
  return sign * Number(`${Math.round(Number(`${Math.abs(value)}e2`))}e-2`);
};

/**
 * [막대 그래프 + 평균 점선] 공용 막대 그래프(UI 체크리스트 68, 건강 일지 차트가 기준)
 * - 지난 값 연하게·마지막 값 진하게, 평균 점선과 오른쪽 "평균 n" 글자
 * - points: [{ label, value }], formatValue: 평균 표기(기본 숫자 그대로), ariaLabel: 화면 읽기용 설명
 * - showAverageLabel: 오른쪽 "평균 n" 글자 표시(기본 true). false면 글자 자리 없이 막대를 오른쪽 끝까지 그린다(평균을 그래프 밖 범례로 보여 줄 때)
 * - height: 높이(px) 숫자, 또는 그래프 폭을 받아 높이를 돌려주는 함수. 넘기지 않으면 122
 * - 폭은 감싸는 요소를 따른다(ResizeObserver)
 */
export default function BarChart({
  points,
  formatValue = String,
  ariaLabel,
  showAverageLabel = true,
  height = HEIGHT,
}) {
  const [ref, width] = useElementWidth();

  return (
    <div ref={ref} className="w-full">
      {width > 0 && (
        <Chart
          width={width}
          points={points}
          formatValue={formatValue}
          ariaLabel={ariaLabel}
          showAverageLabel={showAverageLabel}
          height={typeof height === 'function' ? height(width) : height}
        />
      )}
    </div>
  );
}

function Chart({
  width,
  points,
  formatValue,
  ariaLabel,
  showAverageLabel,
  height,
}) {
  const count = points.length;
  const right = showAverageLabel ? (width < 600 ? 84 : 104) : PAD.left;
  const max = Math.max(
    MIN_MAX_VALUE,
    Math.ceil(Math.max(...points.map((point) => point.value)) / 10) * 10,
  );
  const average = points.reduce((sum, point) => sum + point.value, 0) / count;
  const step = (width - PAD.left - right) / count;
  const barWidth = Math.min(step * 0.56, 56);
  const getY = (value) =>
    PAD.top + ((max - value) * (height - PAD.top - PAD.bottom)) / max;
  const lastIndex = count - 1;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="img"
      aria-label={ariaLabel}
      className="block h-auto"
    >
      <path
        d={`M${PAD.left} ${height - PAD.bottom}H${width - right}`}
        stroke="var(--color-line)"
        strokeWidth="1"
      />
      {points.map((point, index) => {
        const centerX = PAD.left + step * index + step / 2;
        return (
          <g key={point.label}>
            <rect
              x={centerX - barWidth / 2}
              y={getY(point.value)}
              width={barWidth}
              height={getY(0) - getY(point.value)}
              rx={4}
              fill={
                index === lastIndex
                  ? 'var(--color-brand-500)'
                  : 'var(--color-brand-100)'
              }
            />
            <text
              x={centerX}
              y={getY(point.value) - 8}
              textAnchor="middle"
              fontSize="14"
              fill="var(--color-ink)"
            >
              {point.value}
            </text>
            {(step >= 44 || index % 2 === lastIndex % 2) && (
              <text
                x={centerX}
                y={height - 8}
                textAnchor="middle"
                fontSize="14"
                fill="var(--color-subtle)"
              >
                {point.label}
              </text>
            )}
          </g>
        );
      })}
      <path
        d={`M${PAD.left} ${getY(average)}H${
          showAverageLabel ? width - right + 8 : width - right
        }`}
        stroke="var(--color-brand-500)"
        strokeWidth="1.5"
        strokeDasharray="6 4"
      />
      {showAverageLabel && (
        <text
          x={width - right + 14}
          y={getY(average) + 5}
          fontSize="14"
          fill="var(--color-brand-600)"
        >
          평균 {formatValue(round2(average))}
        </text>
      )}
    </svg>
  );
}
