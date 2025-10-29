import { useMemo } from "react";
import type { PositionData } from "./App.tsx";
import Ticker from "./Ticker.tsx";

export type TickerData = {
  shortName: string;
  longName: string;
  currency: Currency;
  points: number[];
};

type Currency = "US$" | "GB£";

interface TickerListProps {
  instruments: Map<string, TickerData>;
  positions: Map<string, PositionData>;
  prices: Map<string, number[]>;
}

export default function TickerList({
  instruments,
  positions,
  prices,
}: TickerListProps) {
  const positivePriceChangeColor = "#61FB6B";
  const negativePriceChangeColor = "#EE4f4D";
  const tickersWithPositions = useMemo(() => {
    if (!instruments || !positions) {
      return [];
    }
    const temp: TickerData[] = [];
    Array.from(positions.keys()).forEach((key) => {
      const item = instruments.get(key);
      if (item) {
        temp.push(item);
      }
    });
    return temp;
  }, [instruments, positions]);

  return (
    <div className="ticker-list">
      {tickersWithPositions.map((item) => {
        const upper = 50;
        const points = prices.get(item.shortName) || [];
        const priceChange = points[points.length - 1] - points[0];
        const color =
          priceChange > 0 ? positivePriceChangeColor : negativePriceChangeColor;

        return (
          <Ticker key={item.shortName}>
            <Ticker.Names long={item.longName} short={item.shortName} />
            <Ticker.Graph
              color={color}
              upper={upper}
              points={points}
              boundingRect={{ length: 800, width: 300 }}
            />
            <Ticker.Prices
              current={points[points.length - 1]}
              change={priceChange}
              currency={item.currency}
              color={color}
            />
          </Ticker>
        );
      })}
    </div>
  );
}
