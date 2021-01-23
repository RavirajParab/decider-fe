import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Loading from "./Loading";
import {Indication} from "./Indication";
import {RSIIndication} from "./Indication";

const Performance = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(
        "https://deciderse.netlify.app/.netlify/functions/niftyhundred"
      );
      const AllCosString = localStorage.getItem("allcos");
      const AllCos = JSON.parse(AllCosString);
      //set the filetered data for display
      const companies=result.data.map(i=>{
        const cos= AllCos.find(m=>m.Symbol===i.symbol);
        if(cos){
          return {
            ...i,
            rsi: cos.RSI,
            change5: cos.Change5,
            change14: cos.Change14
          }
        }else{
          return null;
        }
      });
     
      const rsiData = companies
        .filter(i=>(i!==undefined && i!=null))
        .sort((a, b) => a.monthlyPercentageChange - b.monthlyPercentageChange);
        console.log(rsiData); 
      setData(rsiData);
    };
    fetchData();
  }, []);

  //monthly button clicked
  const Mode=(flag)=>{
    let reArrangedCos=[];
    if(flag==='1Month')
     reArrangedCos = [...data].sort((a, b) => a.monthlyPercentageChange - b.monthlyPercentageChange);
    else if(flag==='1Year')
    reArrangedCos = [...data].sort((a, b) => a.yearlyPercentageChange - b.yearlyPercentageChange);
    else if(flag==='5Days')
    reArrangedCos = [...data].sort((a, b) => a.change5 - b.change5);
    else if(flag==='14Days')
    reArrangedCos = [...data].sort((a, b) => a.change14 - b.change14);
    else if(flag==='RSI')
    reArrangedCos = [...data].sort((a, b) => a.rsi - b.rsi);
    setData(reArrangedCos);
  }


  return (
    <div>
      {data.rsi ? (
        <Loading />
      ) : (
          <div>
            <button className="btn btn-info" onClick={Mode.bind(this,'5Days')}>5 Days</button>
            <button className="btn btn-info ml-2" onClick={Mode.bind(this,'14Days')}>14 Days</button>
            <button className="btn btn-info ml-2" onClick={Mode.bind(this,'1Month')}>Monthly</button> 
            <button className="btn btn-info ml-2" onClick={Mode.bind(this,'1Year')}>Yearly</button>
            <button className="btn btn-info ml-2" onClick={Mode.bind(this,'RSI')}>RSI</button>
            {" "}
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">SL</th>
                  <th scope="col">Tgt</th>
                  <th scope="col">RSI</th>
                  <th scope="col">5Days</th>
                  <th scope="col">14Days</th>
                  <th scope="col">1Month</th>
                  <th scope="col">1Year</th>
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
                          i.symbol
                        }
                      >
                        <span style={{ color: i.percentChange < 0 ? 'Red' : 'Green' }}>{i.symbol}</span>
                      </a>({Math.round(100000/i.lastTradedPrice)}){" "}<br/>
                    </td>
                    <td>{(Number(i.lastTradedPrice)*0.005).toFixed(1)}</td>
                    <td>{(Number(i.lastTradedPrice)*0.009).toFixed(1)}</td>
                    <td><RSIIndication data={i.rsi} /></td>
                    <td><Indication data={i.change5} /></td>
                    <td><Indication data={i.change14} /></td>
                    <td><Indication data={i.monthlyPercentageChange} /></td>
                    <td><Indication data={i.yearlyPercentageChange} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default Performance;
