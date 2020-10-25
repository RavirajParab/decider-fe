import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Loading from "./Loading";

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
        return {
          ...i,
          rsi: AllCos.find(m=>m.Symbol===i.symbol).RSI
        }
      });
     
      const rsiData = companies
        .sort((a, b) => a.monthlyPercentageChange - b.monthlyPercentageChange);
      setData(rsiData);
    };
    fetchData();
  }, []);

  //monthly button clicked
  const monthMode=(flag)=>{
    let reArrangedCos=[];
    if(flag)
     reArrangedCos = [...data].sort((a, b) => a.monthlyPercentageChange - b.monthlyPercentageChange);
    else
    reArrangedCos = [...data].sort((a, b) => a.yearlyPercentageChange - b.yearlyPercentageChange);

    setData(reArrangedCos);
  }


  return (
    <div>
      {data.rsi ? (
        <Loading />
      ) : (
          <div>
            <button className="btn btn-warning" onClick={monthMode.bind(this,true)}>Monthly</button> 
            <button className="btn btn-info ml-2" onClick={monthMode.bind(this,false)}>Yearly</button>
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
                          i.symbol
                        }
                      >
                        <span style={{ color: i.monthlyNetChange < 0 ? 'Red' : 'Green' }}>{i.symbol}</span>
                      </a>{" "}<br/>
                      <span className="btn btn-primary">
                        MR <span className="badge badge-light">{i.monthlyPercentageChange}</span>
                      </span>
                      <span className="btn btn-success ml-2">
                        YR <span className="badge badge-light">{i.yearlyPercentageChange}</span>
                      </span>
                    </td>
                    <td>{i.rsi}</td>
                    <td>{i.lastTradedPrice}</td>
                    <td>{i.percentChange}</td>

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
