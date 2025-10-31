interface GraphProps {
  color: string;
  upper: number;
  points: number[];
  boundingRect: BoundingRect;
}

type BoundingRect = {
  length: number;
  width: number;
};

export default function Graph({
  color,
  upper,
  points,
  boundingRect,
}: GraphProps) {
  const minimum = Math.max(...points);
  const maximum = Math.min(...points);
  const priceRange = minimum - maximum || 1;
  
  const gradientId = `gradient-${color.replace("#", "").substring(0, 6)}`;
  
  const normalizePrice = (price: number): number => {
    const normalized = (price - maximum) / priceRange;
    return boundingRect.width * (1 - normalized);
  };
  
  const randomPoints = toSvgPoints(points, normalizePrice);
  const normalizedMinimum = normalizePrice(minimum);
  const svgPoints =
    `0,${boundingRect.width}\n` +
    randomPoints +
    `\n${20 * upper},${boundingRect.width}`;

  return (
    <svg
      viewBox={`0 0 ${boundingRect.length} ${boundingRect.width}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill={`url(#${gradientId})`} stroke="transparent" points={svgPoints} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="10"
        points={randomPoints}
      />
      <line
        x1="0"
        y1={normalizedMinimum}
        x2={boundingRect.length}
        y2={normalizedMinimum}
        stroke={color}
        strokeWidth="8"
        strokeDasharray="30 10"
        opacity="1"
      />
    </svg>
  );
}

const toSvgPoints = (points: number[], normalizePrice: (price: number) => number): string => {
  return spreadPoints(points, 0, 20, normalizePrice)
    .map((p) => `${p[0]},${p[1]}`)
    .join("\n");
};

const spreadPoints = (
  prices: number[],
  min: number,
  step: number,
  normalizePrice: (price: number) => number,
): [number, number][] => {
  return prices.map((price, idx) => [idx * step + min, normalizePrice(price)]);
};
