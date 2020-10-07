import React, { useState, useEffect } from "react";
import Loading from "./Loading";

const RSIOverbought = (props) => {
  const [data, setData] = useState({ rsi: {} });
  useEffect(() => {
    const fetchData = ()=> {
      const AllCosString = localStorage.getItem("allcos");
      const AllCos = JSON.parse(AllCosString);
      //set the filetered data for display
      const rsiFiltered =AllCos.filter(i=>i.RSI>67).sort((a,b)=>b.RSI-a.RSI)
      console.log(rsiFiltered);
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
                  <td>{i.RSI}</td>
                  <td>{(Number(i.Close)).toFixed(2)}</td>
                  <td>{i.Change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RSIOverbought;
