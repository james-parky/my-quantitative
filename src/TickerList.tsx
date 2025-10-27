import Ticker from "./Ticker.tsx";

export type TickerData = {
    shortName: string,
    longName: string,
    currency: Currency,
}

type Currency = "US$" | "GB£";
type Color = string;
type Trend = "up" | "down";

export default function TickerList({tickerData}: { tickerData: TickerData[] }) {
    const positivePriceChangeColor: Color = "#61FB6B";
    const negativePriceChangeColor: Color = "#EE4f4D";

    return <div className="ticker-list">
        {tickerData.map((item, i) => {
            // TODO: points are randomly generated here but will be supplied as
            //       a field of TickerData from real data.
            const upper = 50;
            const points = nRandomPointsInRange(upper, 260, 130, "up");
            const priceChange = points[points.length - 1] - points[0];
            const color = priceChange > 0 ? positivePriceChangeColor : negativePriceChangeColor;

            return <Ticker key={i}>
                <Ticker.Names long={item.longName} short={item.shortName}/>
                <Ticker.Graph color={color}
                              upper={upper} points={points} boundingRect={{length: 800, width: 300}}/>
                <Ticker.Prices current={points[points.length - 1]}
                               change={priceChange}
                               currency={item.currency}
                               color={color}/>
            </Ticker>
        })}
    </div>
}

const nRandomPointsInRange = (n: number, min: number, max: number, trend: Trend): number[] => {
    const values = [];
    let current = Math.floor((min + max) / 2);
    for (let i = 0; i < n; i++) {
        const range = max - min;
        const jump = Math.random() < 0.5 ? Math.floor(Math.random() * (range * 0.1)) + 5 : Math.floor(Math.random() * (range * 0.3)) + 15; // TODO: bruh
        const bias = trend == "up" ? 0.8 : -0.04;
        const dir = Math.random() + bias > 0.5 ? 1 : -1;
        current += dir * jump;
        values.push(current);
    }

    return values;

}
