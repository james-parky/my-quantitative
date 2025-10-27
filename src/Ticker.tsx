import {type ReactNode} from 'react';
import Graph from './Graph';

interface NameProps {
    long: string,
    short: string,
}

interface PriceProps {
    color: string,
    change: number,
    current: number,
    currency: string,
}

export default function Ticker({children}: { children: ReactNode }) {
    return <div className="glass ticker">{children}</div>;
}

function Names({long, short}: NameProps) {
    return <div className="ticker__names">
        <p className="ticker__names__short">{short}</p>
        <p className="ticker__names__long">{long}</p>
    </div>
}

function Prices({color, change, current, currency}: PriceProps) {
    return <div className="ticker__price-info">
        <p className="ticker__price-info__current-price">{currency}{current}</p>
        <p className="ticker__price-info__price-change" style={{backgroundColor: color}}>
            {change > 0 ? "+" : ""}{change}
        </p>
    </div>
}

Ticker.Names = Names;
Ticker.Prices = Prices;
Ticker.Graph = Graph;