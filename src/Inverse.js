import React, { useState, useEffect } from "react";
import Axios from 'axios';
import {Indication} from "./Indication";


const Inverse = (props) => {
    const InverseStocks =[
    {
        Symbol :"CIPLA",
        sid :"CIPL"
    },
    {
        Symbol :"SUNPHARMA",
        sid :"SUN"
    },{
        Symbol :"LUPIN",
        sid :"LUPN"
    },{
        Symbol :"AUROPHARMA",
        sid :"ARBN"
    },{
        Symbol :"TCS",
        sid :"TCS"
    },{
        Symbol :"INFY",
        sid :"INFY"
    },{
        Symbol :"WIPRO",
        sid :"WIPR"
    },{
        Symbol :"HCLTECH",
        sid :"HCLT"
    }
    ];
  
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const result = await Axios.get(
                "https://deciderse.netlify.app/.netlify/functions/quotes?sid=CIPL,SUN,LUPN,ARBN,TCS,INFY,WIPR,HCLT"
            );
            //add RSI data
            const inverseData = result.data.map((x,index) => {
                return { ...x, Symbol: InverseStocks[index].Symbol }
            });
            setData(inverseData);
        };
        fetchData();
    }, []);

    return (
        <div>
            {/* <button className="btn btn-info ml-2" onClick={refresh}>Refresh</button> */} 
            <h3>Inverse Stocks<hr/></h3>        
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">SL</th>
                <th scope="col">Target</th>
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
                     <span style={{color:i.change<0?'Red':'Green'}}>{i.Symbol}</span>
                    </a>{" "}
                    ({Math.round(100000/i.price)})
                  </td>
                  
                    <td>{(i.price*0.005).toFixed(1)}</td>
                    <td>{(i.price*0.009).toFixed(1)}</td> 
                    <td>{(Number(i.price)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table> 
        </div>
    );
};

export default Inverse;


