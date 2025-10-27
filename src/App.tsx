import './App.css'
import type {TickerData} from "./TickerList";
import TickerList from "./TickerList";

const mockDataApple: TickerData = {
    shortName: "AAPL",
    longName: "Apple Inc.",
    currency: "US$"
};

const mockDataStarbucks: TickerData = {
    shortName: "SBUX",
    longName: "Starbucks Corporation",
    currency: "US$"
};

const mockTickerData: TickerData[] = Array.from(
    {length: 10},
    (_, i) => (i % 2 ? mockDataApple : mockDataStarbucks)
);


export default function App() {
    return (
        <div className="app">
            <h1 className="instrument-serif-regular" style={{
                textAlign: "center",
                fontVariant: "small-caps",
                width: "100%",
                fontSize: "4.25rem",
            }}>My Quantitative Ltd.</h1>
            <p>£ PNL</p>
            <TickerList tickerData={mockTickerData}/>
            <div className="form"><p>form here</p></div>
        </div>
    )
}