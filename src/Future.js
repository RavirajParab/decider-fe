import React, { useState, useEffect } from "react";
import Axios from "axios";
import {Indication} from "./Indication";
import {RSIIndication} from "./Indication";

const Future = (props) => {
   //Get the local forecast data
   const [data, setData] = useState([]);
   const AllCosString = localStorage.getItem("allcos");
   const AllCos = JSON.parse(AllCosString);

    useEffect(() => {
        const fetchData = async () => {
            const result = await Axios.get(
                "https://deciderse.netlify.app/.netlify/functions/forecasts"
            );

            const allPositives = result.data.filter(i => {
                return i.eps.forecast >= i.eps.cagr3 && i.price.forecast >= i.price.cagr3 && i.revenue.forecast >= i.revenue.cagr3
            }).map(x=>{
                const co = AllCos.filter(k=>k.sid===x.sid);
                if(co.length===0){
                    console.log(`${x.sid} is missing; need to add it to Data.js`);
                    co.Symbol='Missing';
                  }
                  else{
                    return {...co[0],...x}
                  }
            })
            .filter(o=>o!==undefined)
            .sort((a,b)=>(a.RSI-b.RSI))
            console.log(allPositives);
            setData(allPositives);
        };
        fetchData();
    }, []);
 
    return (
        <div>
            <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">RSI</th>
                <th scope="col">Price</th>
                <th scope="col">Change</th>
                <th scope="col">F-EPS</th>
                <th scope="col">F-Price</th>
                <th scope="col">F-Revenue</th>
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
                    <td>{i.eps.forecast}</td>
                    <td>{i.price.forecast}</td>
                    <td>{i.revenue.forecast}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
    )
}

export default Future;