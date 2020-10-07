import React, { useState, useEffect } from "react";
import Loading from "./Loading";

const Etf = (props) => {
  const [data, setData] = useState({ rsi: {} });
  useEffect(() => {
    const fetchData = () => {
      const Etfs = [{
        Name: 'N100',
        Link: 'https://in.tradingview.com/symbols/NSE-N100/technicals/'
      }, {
        Name: 'GOLDBEES',
        Link: 'https://in.tradingview.com/symbols/NSE-GOLDBEES/technicals/'
      }, {
        Name: 'NIFTYBEES',
        Link: 'https://in.tradingview.com/symbols/NSE-NIFTYBEES/technicals/'
      }, {
        Name: 'SETFNIFBK',
        Link: 'https://in.tradingview.com/symbols/NSE-SETFNIFBK/technicals/'
      }, {
        Name: 'NETFIT',
        Link: 'https://in.tradingview.com/symbols/NSE-NETFIT/technicals/'
      }, {
        Name: 'JUNIORBEES',
        Link: 'https://in.tradingview.com/symbols/NSE-JUNIORBEES/technicals/'
      },{
        Name: 'ICICIBANKP',
        Link: 'https://in.tradingview.com/symbols/NSE-ICICIBANKP/technicals/'
      },{
        Name: 'NETFMID150',
        Link: 'https://in.tradingview.com/symbols/NSE-NETFMID150/technicals/'
      }]
      setData(Etfs);
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
                  <th scope="col">Chart</th>
                </tr>
              </thead>
              <tbody>
                {data.map((i, index) => (
                  <tr key={index}>
                    <td>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={i.Link}
                      >
                        {i.Name}
                      </a>{" "}
                    </td>
                    <td>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          "https://in.tradingview.com/chart/?symbol=NSE%3A" +
                          i.Name
                        }
                      >
                        View
                    </a>{" "}
                    </td>
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
