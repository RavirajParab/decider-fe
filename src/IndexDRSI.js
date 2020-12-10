import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Indication } from "./Indication";
import { RSIIndication } from "./Indication";


const IndexDRSI = (props) => {
  const [data, setData] = useState([]);

  const getData = async () => {

    const result = await Axios.get(
      `https://deciderse.netlify.app/.netlify/functions/quotes?sid=.NIFTYAUTO,.NIFTYPSU,.NIFTYMED,.NIFTYFIN,.NSEBANK,.NIFTYIT,.NIPHARM,.NIFTYMET,.NIFTYREAL,.NIFTYFMCG&date=${new Date().toISOString()}`
    );

    const processedData = result.data.map(i => {
      return {
        SID: i.sid.split('.')[1],
        Change: Number((i.change * 100 / i.c).toFixed(2)),
        DRSI: i.drsi
      }
    }).sort((a, b) => b.DRSI - a.DRSI);
    return processedData;
  }

  const refresh = async () => {
    const callData = await getData();
    setData(callData);
  }

  useEffect(() => {
    const fetchData = async () => {
      const callData = await getData();
      setData(callData);
    };
    fetchData();
  }, []);

  return (
    <div >
      <button className="btn btn-info ml-2" onClick={refresh}>Refresh</button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">SID</th>
            <th scope="col">Change</th>
            <th scope="col">DRSI</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((i, index) =>
              <tr key={index}>
                <td>
                  <span style={{ color: i.Change < 0 ? 'Red' : 'Green' }}>{i.SID}</span>
                </td>
                <td>
                  <Indication data={i.Change} /></td>
                <td>

                  <RSIIndication data={i.DRSI} />
                </td>

              </tr>)
          }

        </tbody>
      </table>
    </div>
  );
};

export default IndexDRSI;
