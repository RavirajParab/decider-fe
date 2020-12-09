import React, { useState, useEffect } from "react";
import Axios from 'axios';
import {Indication} from "./Indication";
import {RSIIndication} from "./Indication";

const ShortCandidate = (props) => {
  const [AllCosSorted, SetAllCosSorted] = useState([]);
  const [Now, setNow] = useState(0);

  const Mode=(flag)=>{
    let reArrangedCos=[];
    if(flag==='RSI')
    reArrangedCos = [...AllCosSorted].sort((a, b) => b.RSI - a.RSI);
    else if(flag==='DRSI')
    reArrangedCos = [...AllCosSorted].sort((a, b) => b.drsi - a.drsi);
    console.log(reArrangedCos);
    SetAllCosSorted(reArrangedCos);
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(
        "https://deciderse.netlify.app/.netlify/functions/shorting?date=${new Date().toISOString()}"
      );
      const shortingData = result.data.map(i=>i.Symbol);
      const AllCosString = localStorage.getItem("allcos");
      const AllCosSortedData = JSON.parse(AllCosString);
      const filteredCompanies = shortingData.map( m=>{
        const company = AllCosSortedData.find(n=>n.Symbol===m);
      
       return company;
      }).sort((a,b)=>a.Change-b.Change)
      .filter(m=>m!==undefined)
      .filter(m=>m!==null)
      .map(async x=>{
        const lrsiProm = await Axios.get(
          `https://deciderse.netlify.app/.netlify/functions/liversi?sid=${x.sid}`
        );
        return {...x, drsi:lrsiProm.data.RSI}; 
      });
      const filteredCompaniesData = await Promise.all(filteredCompanies);
      SetAllCosSorted(filteredCompaniesData);
    };
    fetchData();
  }, [Now]);
  
  
  const refresh =()=>{
    const newRandom = Math.random()*10000;
    setNow(newRandom);
   }
                            
  return (
    <div>
          <button className="btn btn-info" onClick={Mode.bind(this,'RSI')}>RSI</button>
          <button className="btn btn-info ml-2" onClick={Mode.bind(this,'DRSI')}>DRSI</button>
          <button className="btn btn-info ml-2" onClick={refresh}>Refresh</button>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">SL</th>
                <th scope="col">Tgt</th>
                <th scope="col">RSI</th>
                <th scope="col">DRSI</th>
                <th scope="col">Price</th>
                <th scope="col">Change</th>
              </tr>
            </thead>
            <tbody>
              {AllCosSorted.map((i, index) => (
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
                     <span style={{color:i.YesterdayChange<0?'Red':'Green'}}>{i.Symbol}</span>
                    </a>{" "} ({Math.round(100000/i.Close)})
                  </td>
                 
                    <td>{(Number(i.Close)*0.006).toFixed(1)}</td>
                    <td>{(Number(i.Close)*0.007).toFixed(1)}</td>
                    <td><RSIIndication data={i.RSI} /></td>
                  <td><RSIIndication data={i.drsi} /></td>
                  <td>{(Number(i.Close)).toFixed(2)}</td>
                  <td><Indication data={i.Change} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  );
};

export default ShortCandidate;
