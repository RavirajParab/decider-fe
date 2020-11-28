import React, { useState, useEffect } from "react";
import Axios from "axios";
import {Indication} from "./Indication";
import {RSIIndication} from "./Indication";


const Forecasts = (props) => {
  console.log('test....')
  const [data, setData] = useState([]);
  const AllCosString = localStorage.getItem("allcos");
  const AllCos = JSON.parse(AllCosString);

  const Mode=(flag)=>{
    let reArrangedCos=[];
    if(flag==='RSI')
    reArrangedCos = [...data].sort((a, b) => b.RSI - a.RSI);
    else if(flag==='DRSI')
    reArrangedCos = [...data].sort((a, b) => b.DRSI - a.DRSI);
    setData(reArrangedCos);
  }
 
  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(
        "https://deciderse.netlify.app/.netlify/functions/forecasts"
      );  
     
      const rsiData = result.data
                            .map(m=>{
                              const co = AllCos.filter(k=>k.sid===m.SID);
                              if(co.length===0){
                                console.log(`${m.SID} is missing; need to add it to Data.js`);
                                co.Symbol='Missing';
                              }
                              else{
                                return {Symbol:co[0].Symbol,
                                        EPS:m.eps,
                                        Price:m.price,
                                        Revenue:m.revenue}
                              }
                            })
                            .filter(i=>i!==undefined)
                            .sort((a, b) => b.RSI - a.RSI);
      console.log(rsiData); 
      setData(rsiData);
    };
    fetchData();
  }, []);
  
  return (
    <div>
          <button className="btn btn-info" onClick={Mode.bind(this,'RSI')}>RSI</button>
          <button className="btn btn-info ml-2" onClick={Mode.bind(this,'DRSI')}>DRSI</button>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">RSI</th>
                <th scope="col">DRSI</th>
                <th scope="col">Change</th>
                <th scope="col">Price</th>
                
              </tr>
            </thead>
            <tbody>
              {data.map((i, index) => (
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
                    </a>{" "}
                  </td>
                  <td><RSIIndication data={i.RSI} /></td>
                  <td><RSIIndication data={i.DRSI} /></td>
                  <td><Indication data={i.Change} /></td>
                  <td>{(Number(i.Close)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  );
};

export default Forecasts;