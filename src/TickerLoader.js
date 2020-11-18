import React, { useState } from "react";
import Axios from 'axios';
import {RSI, MACD} from "technicalindicators";

const TickerLoader = (props) => {
  const [localStorageStatus, setlocalStorageStatus] = useState(false);
  const [tickerDataProcessed, settickerDataProcessed] = useState(false);
  const [TickerLoaderStatus,setTickerLoaderStatus] = useState('Initialized!')
  
const fixToDecimal=(data)=>{
  if(data){
      return Number(data.toFixed(2));
  }
  else{
      return 0;
  }
}

  //set the local storage from ticker data
  const setTickerDataToLocalStorage =async ()=>{
    setTickerLoaderStatus('...fetching ticker data');
    const result = await Axios.get(
      "https://deciderse.netlify.app/.netlify/functions/ticker"
    );
    //set the ticker data to local storage
    localStorage.setItem('tickerdata',JSON.stringify(result));
    setlocalStorageStatus(true);
    setTickerLoaderStatus('Ticker data loaded, click updateticker button');
  }
  // caclulate RSI and MACD
  
const calculateRSI=(i,lq)=>{
  const prevClosings= i.historical.map(i=>i.lp);
  prevClosings.push(lq.price);
  const itemsToBeRemoved = prevClosings.length - 15;
  prevClosings.splice(0, itemsToBeRemoved);
  const inputRSI = {
      values: prevClosings,
      period: 14,
    };
  const RSIcal =RSI.calculate(inputRSI)[0]
  return RSIcal;
}


const calculateMACD=(i,lq)=>{
  const prevClosings= i.historical.map(i=>i.lp);
  prevClosings.push(lq.price);
  const itemsToBeRemoved = prevClosings.length - 18;
  prevClosings.splice(0, itemsToBeRemoved);
  const inputMACD = {
      values: prevClosings,
      fastPeriod        : 5,
      slowPeriod        : 8,
      signalPeriod      : 3 ,
      SimpleMAOscillator: false,
      SimpleMASignal    : false
    };
  const MACDcal =MACD.calculate(inputMACD);
  const finalMACD = MACDcal[MACDcal.length-1];
  return finalMACD;
}

  //reprocess the data from localstorage and reset it
   const processTickerData = ()=>{
    try{
      setTickerLoaderStatus('Ticker data processing started....');
      const rawTickerData=JSON.parse(localStorage.getItem('tickerdata'));  
      const processedTickerData= rawTickerData.data.map(i=>{
          if(i.quote){
          let val = {...i};
          delete val.historical;
          delete val.quote;
          const RSI = calculateRSI(i,i.quote);
          const MACDDetails =(calculateMACD(i,i.quote));
          const MACD = fixToDecimal(MACDDetails.MACD);
          const MACDSignal = fixToDecimal(MACDDetails.signal);
          return {...val,...i.quote, RSI, MACD,MACDSignal}
       }
      });
      localStorage.setItem('tickerdataprocessed',JSON.stringify(processedTickerData));
      settickerDataProcessed(true);
      setTickerLoaderStatus('Ticker data processing finished, modifiy filters to see the data');
      
    }catch(err){
       console.log(err);
    }
  }


  return (  
    <div>
      <button className="btn btn-info" onClick={setTickerDataToLocalStorage}>Load Ticker Data</button>
      <button className="btn btn-info ml-2" onClick={processTickerData}>Update Ticker Data</button><br/>
      <span className="muted-text">{TickerLoaderStatus}</span>
    </div>
  );
};

export default TickerLoader;
