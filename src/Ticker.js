import React, { useState, useEffect } from "react";
import * as filters from './TickerFilters';
import TickerLoader from "./TickerLoader";

const Ticker = (props) => {
  const [tickerData, setTickerData] = useState([]);
  const [Data, setData] = useState([]);
  useEffect(() => {
    //get and set the ticker data
    const tickerDataLS = JSON.parse(localStorage.getItem('tickerdataprocessed'));
    setTickerData(tickerDataLS)
  }, []);

  //filterChanged
  const filterChanged=(e)=>{
    const filter=e.target.value;
    //call the filter
   const filteredData= filters[filter](tickerData);
   setData(filteredData);
  }
  
  return (  
    <div>
      <TickerLoader/>
      <h3>Select Filter</h3><br/>
      <label htmlFor="Filter">Select Security</label>
          <select
            className="form-control"
            id="Filter"
            onChange={filterChanged}
          >
              <option key='None'>None</option>
              <option key='MonthlyReturns'>MonthlyReturns</option>
              <option key='YearlyReturns'>YearlyReturns</option>
              <option key='NearLow'>NearLow</option>
              <option key='NiftyLow'>NiftyLow</option>
              <option key='TopTwentyFive'>TopTwentyFive</option>
              <option key='Beta'>Beta</option>
          </select>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Ticker</th>
                <th scope="col">Change</th>
                <th scope="col">mReturns</th>
                <th scope="col">yReturns</th>
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
                        i.ticker
                      }
                    >
                   <span style={{color:i.change<0?'Red':'Green'}}>{i.ticker}</span>  
                    </a>{" "}
                  </td>
                  <td>{(i.change*100/i.price).toFixed(2)}</td>
                  <td>{i.monthReturns}</td>
                  <td>{i.yearReturns}</td>
                </tr>
              ))}
            </tbody>
          </table>
    </div>
  );
};

export default Ticker;
