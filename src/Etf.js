import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Loading from "./Loading";
import {Indication} from "./Indication";
import {RSIIndication} from "./Indication";

const Etf = (props) => {
  const [data, setData] = useState([]);
  //fetch RSI function
  const getRSI=(analysis)=>{
    const rsiString= analysis.split('. A')[0].split('is ')[1];
    return Number(rsiString);
  }

  //monthly button clicked
  const Mode=(flag)=>{
    let reArrangedCos=[];
    if(flag==='1Month')
     reArrangedCos = [...data].sort((a, b) => a.mrt - b.mrt);
    else if(flag==='Rise')
    reArrangedCos = [...data].sort((a, b) => a.rise - b.rise);
    else if(flag==='RSI')
    reArrangedCos = [...data].sort((a, b) => a.rsi - b.rsi);
    console.log(reArrangedCos)
    setData(reArrangedCos);
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(
        "https://deciderse.netlify.app/.netlify/functions/ETF"
      );
      const rsiData = result.data
        .map(y=>{
          return {
            ...y,
            rsi : getRSI(y.rsi)
          }
        })
        .sort((a, b) => a.rsi - b.rsi);
      setData(rsiData);
    };
    fetchData();
  }, []);
  return (
    <div>
      {data.rsi ? (
        <Loading />
      ) : (
          <div>
            <button className="btn btn-info ml-2" onClick={Mode.bind(this,'1Month')}>Monthly</button> 
            <button className="btn btn-info ml-2" onClick={Mode.bind(this,'Rise')}>Rise</button>
            <button className="btn btn-info ml-2" onClick={Mode.bind(this,'RSI')}>RSI</button>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">RSI</th>
                  <th scope="col">Rise</th>
                  <th scope="col">1Month</th>
                  <th scope="col">Price</th>
                  <th scope="col">Change</th>
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
                          i.ticker
                        }
                      >
                        <span style={{ color: i.change < 0 ? 'Red' : 'Green' }}>{i.ticker}</span>
                      </a>{" "}<br/>
                    </td>
                    
                    <td><RSIIndication data={i.rsi} /></td>
                    <td>{i.rise}</td>
                    <td><Indication data={i.mrt} /></td>
                    <td>{i.price}</td>
                    <td><Indication data={i.change} /></td>
                    
                    

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default Etf;
