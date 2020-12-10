import React, { useState, useEffect } from "react";
import Axios from "axios";
import IndexRSI from "./IndexDRSI";
  

const Timing = (props) => {
  const [data, setData] = useState({});
  const getData =async ()=>{
    const result = await Axios.get(
      `https://deciderse.netlify.app/.netlify/functions/timing?date=${new Date().toISOString()}`
    );  
    setData(result.data);
  }
  const refresh =async ()=>{
    await getData();
  }
 
  useEffect(() => {
    const fetchData = async () => {
     await getData();
    };
    fetchData();
  }, []);
  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 col-sm-12">
        <button className="btn btn-info ml-2" onClick={refresh}>Refresh</button>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Shorting</th>
                <th scope="col">Buying</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                <td></td>

                <td>
                  {data.shortingOpps?
                   data.shortingOpps.reverse().map((i,index)=>
                   <div className="card text-white bg-dark mb-3 card-text p-4" 
                   style={{maxWidth:"200px"}} 
                   key={index}>
                    {i.RSI}
                    @
                    {new Date(i.TS).toLocaleTimeString()}
                    <br/>({i.TS.split('T')[1]})
                    </div>)
                  :null}
                </td>

                  <td>
                  {data.buyingOpps?
                   data.buyingOpps.reverse().map((i,index)=>
                   <div className="card text-white bg-success mb-3 card-text p-4" 
                   style={{maxWidth:"200px"}} 
                   key={index}>
                    {i.RSI}
                    @
                    {new Date(i.TS).toLocaleTimeString()}
                    <br/>({i.TS.split('T')[1]})
                    </div>)
                  :null}
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-6 col-sm-12">
        <IndexRSI/>
        </div>
        </div> 
        
        </div>
  );
};

export default Timing;
