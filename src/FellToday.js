import React from "react";
import {Indication} from "./Indication";
import {RSIIndication} from "./Indication";

const FellToday = (props) => {
  const AllCosString = localStorage.getItem("allcos");
  const AllCos = JSON.parse(AllCosString);
  const AllCosSorted= AllCos.filter(i=>i.IR<0)
                            .sort((a,b)=>a.IR-b.IR);
  
  return (
    <div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">RSI</th>
                <th scope="col">Price</th>
                <th scope="col">IR</th>
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
                    </a>{" "}
                  </td>
                  <td><RSIIndication data={i.RSI} /></td>
                  <td>{(Number(i.Close)).toFixed(2)}</td>
                  <td><Indication data={i.IR} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  );
};

export default FellToday;
