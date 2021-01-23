import React, { useState, useEffect } from "react";
import Axios from "axios";
import IndexRSI from "./IndexDRSI";


const Timing = (props) => {
  const [data, setData] = useState([]);
  const inRange = (rxTime) => {
    const currentTime = new Date();
    const eventTime = new Date(rxTime);
    const difMill = Math.abs(currentTime - eventTime);
    if (difMill <= 600000) {
      return true;
    }
    return false;
  }
  const getData = async () => {
    const result = await Axios.get(
      `https://deciderse.netlify.app/.netlify/functions/timing?date=${new Date().toISOString()}`
    );
    const processedData = result.data.map(i => {
      return {
        sid: i.sid,
        stime: i.shortTingOpps ? new Date(i.shortTingOpps.TSZ).toLocaleTimeString() : "-",
        btime: i.buyingOpps ? new Date(i.buyingOpps.TSZ).toLocaleTimeString() : "-",
        srange: i.shortTingOpps ? inRange(i.shortTingOpps.TSZ) : false,
        brange: i.buyingOpps ? inRange(i.buyingOpps.TSZ) : false
      }
    })
    console.log(processedData);
    setData(processedData);
  }
  const refresh = async () => {
    await getData();
  }

  useEffect(() => {
    if ((new Date()).getHours() < 16) {
      const interval = setInterval(async () => {
        await getData();
      }, 120000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getData();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <button className="btn btn-info ml-2" onClick={refresh}>Refresh</button>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">SID</th>
                <th scope="col">Shorting</th>
                <th scope="col">Buying</th>
              </tr>
            </thead>
            <tbody>
              {
                data.map((i, index) => <tr key={index}>
                  <td>
                    {i.sid}
                  </td>

                  <td style={{ backgroundColor: i.srange ? 'lightgreen' : null }}>
                     {i.stime==='Invalid Date'?'-':i.stime}
                  </td>

                  <td style={{ backgroundColor: i.brange ? 'lightgreen' : null }}>
                    {i.btime==='Invalid Date'?'-':i.btime}
                  </td>
                </tr>)
              }

            </tbody>
          </table>
        </div>
        <div className="col-md-6 col-sm-12">
          <IndexRSI />
        </div>
      </div>

    </div>
  );
};

export default Timing;
