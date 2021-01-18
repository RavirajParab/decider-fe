import React, { useState, useEffect } from "react";
import * as filters from './ScreenerFilters';
import TickerTrendLoader from "./TickerTrendLoader";

const ScreenerExecutor = (props) => {
    const [SecData, setSecData] = useState([]);
    const [Data, setData] = useState([]);
    const [HitRate, setHitRate] = useState([]);
    useEffect(() => {
        //get and set the ticker data
        const DataLS = JSON.parse(localStorage.getItem('allcos'));
        setSecData(DataLS)
    }, []);

    //filterChanged
    const filterChanged = (e) => {
        const filter = e.target.value;
        //call the filter
        const filteredData = filters[filter](SecData);
        if (filteredData.filteredData) {
            setData(filteredData.filteredData);
            setHitRate(filteredData.HitRate);
        } else {
            setData([]);
            setHitRate(0);
        }
    }


    return (
        <div>
            <TickerTrendLoader />
            <h3>Select Filter {HitRate}</h3><br />
            <label htmlFor="Filter">Select Security</label>
            <select
                className="form-control"
                id="Filter"
                onChange={filterChanged}
            >
                <option key='None'>None</option>
                <option key='StrategySix'>StrategySix</option>
                <option key='StrategySeven'>StrategySeven</option>
            </select>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Symbol</th>
                        <th scope="col">DRSI</th>
                        <th scope="col">IR</th>
                        <th scope="col">5MC</th>
                        <th scope="col">15MC</th>
                        <th scope="col">PChange5</th>

                    </tr>
                </thead>
                <tbody>
                    {Data ? Data.map((i, index) => (
                        <tr key={index}>
                            <td>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={
                                        "https://in.tradingview.com/chart/?symbol=NSE%3A" +
                                        i.Symbol
                                    }
                                >
                                    <span style={{ color: (Number(i.Open) - Number(i.Close)) > 0 ? 'Red' : 'Green' }}>{i.Symbol}</span>
                                </a>{" "}
                            </td>
                            <td>{i.RSI.toFixed(2)}</td>
                            <td>{i.IR}</td>
                            <td>{i.Trend.First5MinR.toFixed(2)}</td>
                            <td>{i.Trend.First15MinR.toFixed(2)}</td>
                            <td>{i.PChange5.toFixed(2)}</td>
                        </tr>
                    )) : null}
                </tbody>
            </table>
        </div>
    );
};

export default ScreenerExecutor;
