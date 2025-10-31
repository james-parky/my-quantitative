import { useMemo, useState, type SetStateAction } from "react";
import { Select, InputNumber, Button } from "antd";
import type { TickerData } from "./TickerList";
import type { PositionData } from "./App";

const fundOptions = [
  { value: "MYQUANTITATIVE", label: "MYQUANTITATIVE" },
  { value: "JMONEY", label: "JMONEY" },
  { value: "PARKY", label: "PARKY" },
];

interface TradeFormProps {
  instruments: Map<string, TickerData>;
  setPositions: React.Dispatch<SetStateAction<Map<string, PositionData>>>;
  prices: Map<string, number[]>;
}

export default function TradeForm({
  instruments,
  setPositions,
  prices,
}: TradeFormProps) {
  const [instrument, setInstrument] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [fund, setFund] = useState<string>("MYQUANTITATIVE");
  const currentMarketPrice = useMemo(() => {
    if (!instrument || !prices) {
      return;
    }
    const points = prices.get(instrument) ?? [];
    const length = points.length;
    return points[length - 1] ?? "";
  }, [instrument, prices]);

  const direction = quantity >= 0 ? "Buy" : "Sell";
  const directionClass =
    quantity >= 0 ? "form__direction--buy" : "form__direction--sell";

  const handleToggleDirection = () => {
    if (quantity !== 0) {
      setQuantity(-quantity);
    }
  };

  const handleBook = () => {
    if (!instrument || quantity === 0) {
      return;
    }
    setPositions((prev) => {
      const newPositions = new Map(prev);
      const oldQuantity = prev.get(instrument)?.quantity ?? 0;
      newPositions.set(instrument, {
        ticker: instrument,
        quantity: oldQuantity + quantity,
      });
      return newPositions;
    });
  };

  const instrumentOptions = useMemo(() => {
    if (!instruments) {
      return [];
    }
    return Array.from(instruments.entries()).map(([key, tickerData]) => ({
      value: key,
      label: tickerData.shortName,
    }));
  }, [instruments]);

  return (
    <div className="form">
      <div className="form__grid">
        <div className="form__row">
          <label className="form__label">Instrument</label>
          <Select
            className="form__field"
            value={instrument}
            onChange={setInstrument}
            options={instrumentOptions}
          />
        </div>
        <div className="form__row">
          <label className="form__label">Direction</label>
          <div
            className={`form__direction ${directionClass}`}
            onDoubleClick={handleToggleDirection}
          >
            {direction}
          </div>
        </div>
        <div className="form__row">
          <label className="form__label">Quantity</label>
          <InputNumber
            className="form__field"
            value={quantity}
            onChange={(val) => setQuantity(val ?? 0)}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value?.replace(/,/g, "") as unknown as number}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form__row">
          <label className="form__label">Market Price</label>
          <InputNumber
            className="form__field form__field--market-price"
            disabled
            value={currentMarketPrice}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form__row">
          <label className="form__label">Fund</label>
          <Select
            className="form__field"
            value={fund}
            onChange={setFund}
            options={fundOptions}
          />
        </div>
      </div>
      <div className="form__actions">
        <Button
          type="primary"
          size="large"
          onClick={handleBook}
          disabled={quantity === 0}
          className="form__book-button"
        >
          Book
        </Button>
      </div>
    </div>
  );
}
