import React from "react";

const FourteenDaysPerformance = (props) => {
  const AllCosString = localStorage.getItem("allcos");
  const AllCos = JSON.parse(AllCosString);
  const AllCosSorted= AllCos.sort((a,b)=>a.Change14-b.Change14);
  
  return (
    <div>
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
                  <td>{i.RSI}</td>
                  <td>{(Number(i.Close)).toFixed(2)}</td>
                  <td>{i.Change14}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  );
};

export default FourteenDaysPerformance;
