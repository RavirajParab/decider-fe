import React, { useState } from "react";
import Axios from 'axios';
import LocalSIDData from "./data";

const DataLoader = (props) => {
  const [DataLoad,setDataLoad] = useState('Initialized!')
  
  //fetch the RSI data
  const fetchData = async () => {
    const result = await Axios.get(
      "https://deciderse.netlify.app/.netlify/functions/topcompanies"
    );
    result.data.pop();  
    
    
    const rsiData = result.data
                          .filter(i=>i!==null)
                          .filter(i=>i!==undefined)
                          .map(m=>{
                            const co = LocalSIDData.filter(k=>k.Symbol===m.Symbol);
                            let sidc='NA';
                            if(co.length){
                               if(co[0]){
                                 sidc =co[0].sid;
                               }
                            }
                            return {...m,sid:sidc}
                          })
                          .sort((a, b) => a.RSI - b.RSI);
      
    //set the data in the local storage
    localStorage.setItem('allcos',JSON.stringify(rsiData));
    console.log('Step 1 complete');
  };

  const fetchTickerData =async ()=>{
    const result = await Axios.get(
      "https://deciderse.netlify.app/.netlify/functions/ticker"
    );
    const tickerData =result.data.filter(i=>i!=null);
    //set the data in the local storage
    localStorage.setItem('rawTickerData',JSON.stringify(tickerData));
    console.log('Step 2 complete');
  }

  const mergeTickerData =()=>{
    const SIDData = JSON.parse(localStorage.getItem('allcos'));
    const TickerDataRaw = JSON.parse(localStorage.getItem('rawTickerData'));
    const ProcessedTickerData = TickerDataRaw.map(i=>{
      const Company = SIDData.filter(j=>j.sid===i.SID);
      return{
        ...i,
        ...Company[0]
      }
    })
    localStorage.setItem('TickerData',JSON.stringify(ProcessedTickerData));
    console.log('Step 3 complete');
  }

  //reprocess the data from localstorage and reset it
   const processData = async ()=>{
    try{
      setDataLoad('Data collecting started....');
      await fetchData();
      await fetchTickerData();
      await mergeTickerData();
      setDataLoad('Data collecting finished!');
    }catch(err){
       console.log(err);
    }
  }
  return (  
    <div>
      <button className="btn btn-info ml-2" onClick={processData}>Fetch latest Data</button><br/>
      <span className="muted-text">{DataLoad}</span>
    </div>
  );
};

export default DataLoader;
