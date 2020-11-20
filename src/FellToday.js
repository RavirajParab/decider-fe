import React from "react";

const FellToday = (props) => {
  const AllCosString = localStorage.getItem("allcos");
  const AllCos = JSON.parse(AllCosString);
  const AllCosSorted= AllCos.filter(i=>i.Change<0)
                            .sort((a,b)=>a.Change-b.Change);
  
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
                  <td>{i.Change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  );
};

export default FellToday;
