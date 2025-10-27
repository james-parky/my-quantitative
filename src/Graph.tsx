interface GraphProps {
    color: string,
    upper: number,
    points: number[],
    boundingRect: BoundingRect,
}

type BoundingRect = {
    length: number,
    width: number,
}

export default function Graph({color, upper, points, boundingRect}: GraphProps) {
    const minimum = Math.max(...points);
    const randomPoints = toSvgPoints(points);
    const svgPoints = `0,${boundingRect.width}\n` + randomPoints + `\n${20 * upper},${boundingRect.width}`;

    return <svg viewBox={`0 0 ${boundingRect.length} ${boundingRect.width}`} version="1.1"
                xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={color} stopOpacity="0"/>
            </linearGradient>
        </defs>
        <polygon fill="url(#color)"
                 stroke="transparent"
                 points={svgPoints}
        />
        <polyline fill="none" stroke={color} strokeWidth="10" points={randomPoints}/>
        <line x1="0" y1={minimum} x2={boundingRect.length} y2={minimum} stroke={color} strokeWidth="8"
              strokeDasharray="30 10"
              opacity="1"/>
    </svg>
}

const toSvgPoints = (points: number[]): string => {
    return spreadPoints(points, 0, 20).map(p => `${p[0]},${p[1]}`).join('\n');
}

const spreadPoints = (prices: number[], min: number, step: number): [number, number][] => {
    return prices.map((price, idx) => [idx * step + min, price])
}
