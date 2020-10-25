import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Loading from "./Loading";

const Etf = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(
        "https://deciderse.netlify.app/.netlify/functions/ETF"
      );
      const rsiData = result.data
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
                          i.ticker
                        }
                      >
                        <span style={{ color: i.change < 0 ? 'Red' : 'Green' }}>{i.ticker}</span>
                      </a>{" "}<br/>
                      <span className="btn btn-primary">
                        MR <span className="badge badge-light">{i.mrt}</span>
                      </span>
                      <span className="btn btn-success ml-2">
                        YR <span className="badge badge-light">{i.yrt}</span>
                      </span>
                    
                    </td>
                    <td>{i.rsi}</td>
                    <td>{i.price}</td>
                    <td>{i.change}</td>

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
