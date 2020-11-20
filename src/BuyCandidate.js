import React, { useState, useEffect } from "react";
import Axios from 'axios';

const BuyCandidate = (props) => {
  const [AllCosSorted, SetAllCosSorted] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(
        "https://deciderse.netlify.app/.netlify/functions/buying"
      );
      const shortingData = result.data.map(i=>i.Symbol);
      const AllCosString = localStorage.getItem("allcos");
      const AllCosSortedData = JSON.parse(AllCosString);
      const filteredCompanies = shortingData.map(m=>{
        const company = AllCosSortedData.find(n=>n.Symbol==m);
        return company;
      }).sort((a,b)=>b.Change-a.Change)
      .filter(m=>m!=undefined);
      SetAllCosSorted(filteredCompanies);
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

export default BuyCandidate;
