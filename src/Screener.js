import React, { useState, useEffect } from "react";
import * as filters from './ScreenerFilters';
import TickerTrendLoader from "./TickerTrendLoader";


const Screener = (props) => {
  const [SecData, setSecData] = useState([]);
  const [Data, setData] = useState([]);
  const [HitRate, setHitRate] = useState([]);
  const [PL, setPL] = useState(0);
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
   if(filteredData.refreshRequired){
    getDynamicData(filteredData.data);
   }else{
    //console.log(filteredData.data);
    setData(filteredData.data);
    setCalculatedHitRate(filteredData.data);
   }
   //Finally set the PL
   const calculatedPL = filters.evaluatePLMoney(filteredData.data);
   setPL(calculatedPL.NetPLPostTax);
  }

  const setCalculatedHitRate =(data)=>{
    //Evaluate the Hit Rate  
    const fell = data.filter(i=>i.IR<0);
    const HitRate =(fell.length*100/data.length).toFixed(2);
    setHitRate(HitRate);
  }

  const getDynamicData =async (filteredData)=>{
    if(filteredData){
      const sids = filteredData.map(i=>i.sid).join(',');
      const urlProm = await fetch(`https://deciderse.netlify.app/.netlify/functions/drsilite?sid=${sids}`);
      const rawData = await urlProm.json();
      const mergeData = filteredData.map((i,index)=>{
        return {...i,...rawData[index]}
      });
      setData(mergeData);
      setCalculatedHitRate(mergeData);
    }else{
      setData([]);
      setHitRate(0);
    }
    
  }
  
  return (  
    <div>
      <TickerTrendLoader/>
      <h3>Select Filter {HitRate} | PL {PL}  </h3><br/>
      <label htmlFor="Filter">Select Security</label>
          <select
            className="form-control"
            id="Filter"
            onChange={filterChanged}
          >
              <option key='None'>None</option>
              <option key='StrategyOne'>StrategyOne</option>
              <option key='StrategyTwo'>StrategyTwo</option>
              <option key='StrategyThree'>StrategyThree</option>
              <option key='StrategyFour'>StrategyFour</option>
              <option key='StrategyFive'>StrategyFive</option>
          </select>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Symbol</th>
                <th scope="col">DRSI</th>
                <th scope="col">IR</th>
                
                
              </tr>
            </thead>
            <tbody>
              {Data?Data.map((i, index) => (
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
                   <span style={{color:(Number(i.Open)-Number(i.Close))>0?'Red':'Green'}}>{i.Symbol?i.Symbol:i.SID}</span>  
                    </a>{" "}
                  </td>
                  <td>{i.RSI?i.RSI.toFixed(2): '-'}</td>
                  <td>{i.IR}</td>
                 
                </tr>
              )):null}
            </tbody>
          </table>
    </div>
  );
};

export default Screener;
