import React, { useState, useEffect } from "react";
import * as filters from './ScreenerFilters';
import DataLoader from "./DataLoader";

const Screener = (props) => {
  const [SecData, setSecData] = useState([]);
  const [Data, setData] = useState([]);
  const [HitRate, setHitRate] = useState([]);
  useEffect(() => {
    //get and set the ticker data
    const DataLS = JSON.parse(localStorage.getItem('allcos'));
    setSecData(DataLS)
  }, []);

  //filterChanged
  const filterChanged=(e)=>{
    const filter=e.target.value;
    //call the filter
   const filteredData= filters[filter](SecData);
   setData(filteredData.filteredData);
   setHitRate(filteredData.HitRate)
  }
  
  return (  
    <div>
      <DataLoader/>
      <h3>Select Filter {HitRate}</h3><br/>
      <label htmlFor="Filter">Select Security</label>
          <select
            className="form-control"
            id="Filter"
            onChange={filterChanged}
          >
              <option key='None'>None</option>
              <option key='StrategyOne'>StrategyOne</option>
              <option key='StrategyTwo'>StrategyTwo</option>
            
          </select>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Symbol</th>
                <th scope="col">RSI</th>
                <th scope="col">Change</th>
                <th scope="col">Pts</th>
                <th scope="col">Change5</th>
                <th scope="col">Change14</th>
              </tr>
            </thead>
            <tbody>
              {Data.map((i, index) => (
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
                   <span style={{color:(Number(i.Open)-Number(i.Close))>0?'Red':'Green'}}>{i.Symbol}</span>  
                    </a>{" "}
                  </td>
                  <td>{i.RSI.toFixed(2)}</td>
                  <td>{i.Change.toFixed(2)}</td>
                  <td>{(Number(i.Close)-Number(i.Open)).toFixed(2)}</td>
                  <td>{i.Change5.toFixed(2)}</td>
                  <td>{i.Change14.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
    </div>
  );
};

export default Screener;
