import "./App.css";
import {useEffect, useState} from "react";
import type {TickerData} from "./TickerList";
import TickerList from "./TickerList";
import TradeForm from "./TradeForm";

type Trend = "up" | "down";


const generateNextPrice = (
  currentPrice: number,
  min: number,
  max: number,
  trend: Trend,
): number => {
  const range = max - min;
  
  const smallJump = 0.01;
  const largeJump = 0.05;
  
  const jump =
    Math.random() < 0.7
      ? Math.floor(Math.random() * (range * smallJump)) + 1
      : Math.floor(Math.random() * (range * largeJump)) + 3;
  
  const bias = trend === "up" ? 0.7 : 0.3;
  const dir = Math.random() < bias ? 1 : -1;
  const newPrice = currentPrice + dir * jump;
  return Math.max(min, Math.min(max, newPrice));
};

const nRandomPointsInRange = (
  n: number,
  min: number,
  max: number,
  trend: Trend,
  startingPrice: number,
): number[] => {
  const values = [];
  let current = startingPrice;
  for (let i = 0; i < n; i++) {
    current = generateNextPrice(current, min, max, trend);
    values.push(current);
  }
  return values;
};

const initialMockDataApple: TickerData = {
  shortName: "AAPL",
  longName: "Apple Inc.",
  currency: "US$",
  points: nRandomPointsInRange(50, 130, 260, "up", 120),
};

const initialMockDataStarbucks: TickerData = {
  shortName: "SBUX",
  longName: "Starbucks Corporation",
  currency: "US$",
  points: nRandomPointsInRange(50, 130, 260, "up", 230),
};

export type PositionData = {
  ticker: string;
  quantity: number;
};

type TickerConfig = {
  min: number;
  max: number;
  trend: Trend;
};

const tickerConfigs: Record<string, TickerConfig> = {
  AAPL: { min: 130, max: 260, trend: "up" },
  SBUX: { min: 130, max: 260, trend: "down" },
};

export default function App() {
  const [instruments] = useState<Map<string, TickerData>>(
    () =>
      new Map<string, TickerData>([
        ["AAPL", initialMockDataApple],
        ["SBUX", initialMockDataStarbucks],
      ]),
  );

  const [prices, setPrices] = useState<Map<string, number[]>>(() => {
    const initialPrices = new Map<string, number[]>();
    initialPrices.set("AAPL", initialMockDataApple.points);
    initialPrices.set("SBUX", initialMockDataStarbucks.points);
    return initialPrices;
  });

  const [positions, setPositions] = useState<Map<string, PositionData>>(
    new Map(),
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPrices((prevPrices) => {
        const newPrices = new Map<string, number[]>();

        prevPrices.forEach((pointsArray, key) => {
          const config = tickerConfigs[key];
          if (!config) {
            newPrices.set(key, pointsArray);
            return;
          }

          const lastPrice = pointsArray[pointsArray.length - 1];
          const newPrice = generateNextPrice(
            lastPrice,
            config.min,
            config.max,
            config.trend,
          );
          const updatedPoints = [...pointsArray.slice(1), newPrice];
          newPrices.set(key, updatedPoints);
        });

        return newPrices;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="app">
      <h1
        className="instrument-serif-regular"
        style={{
          textAlign: "center",
          fontVariant: "small-caps",
          width: "100%",
          fontSize: "4.25rem",
        }}
      >
        My Quantitative Ltd.
      </h1>
      <p>£ PNL</p>
      <TickerList instruments={instruments} positions={positions} prices={prices}/>
      <TradeForm instruments={instruments} setPositions={setPositions} prices={prices}/>
    </div>
  );
}
