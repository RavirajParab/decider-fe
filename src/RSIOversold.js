import React, { useState, useEffect } from "react";
import Axios from "axios";
import Loading from "./Loading";

const RSIOversold = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(
        "https://fndecider.azurewebsites.net/api/TopCompanies"
      );
      result.data.pop();
      
      const rsiData = result.data
                            .filter(i=>i!==null)
                            .sort((a, b) => a.RSI - b.RSI);
        
      //set the data in the local storage
      localStorage.setItem('allcos',JSON.stringify(rsiData));
      //set the filetered data for display
      const rsiFiltered =rsiData.filter(i=>i.RSI<36);
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

export default RSIOversold;
