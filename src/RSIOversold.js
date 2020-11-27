import React, { useState, useEffect } from "react";
import Axios from "axios";
import Loading from "./Loading";
import {Indication} from "./Indication";
import {RSIIndication} from "./Indication";
import LocalSIDData from "./data";

const RSIOversold = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(
        "https://deciderse.netlify.app/.netlify/functions/topcompanies"
      );
      result.data.pop();  
      console.log(LocalSIDData);
      
      const rsiData = result.data
                            .filter(i=>i!==null)
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
      //set the filetered data for display
      const rsiFiltered =rsiData.filter(i=>i.RSI<40);
      setData(rsiFiltered);
    };
    fetchData();
  }, []);

  return (
    <div>
      {data.rsi ? (
        <Loading />
      ) : (
        <div>
          {" "}
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">RSI</th>
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
                        i.Symbol
                      }
                    >
                     <span style={{color:i.YesterdayChange<0?'Red':'Green'}}>{i.Symbol}</span>
                    </a>{" "}
                  </td>
                  <td><RSIIndication data={i.RSI} /></td>
                  <td>{(Number(i.Close)).toFixed(2)}</td>
                  <td><Indication data={i.Change} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RSIOversold;
