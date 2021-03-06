import React, { useState } from "react";
import FullSecurityData from "./data";
import Notifier from "./Notifier";


const Transact = (props) => {
  const [Notification,SetNotification]=useState({});
  const AllCosString = localStorage.getItem("allcos");
  const AllCos = JSON.parse(AllCosString);

  const [SecurityCurrent, SetSecurityCurrent] = useState({});

  const [Qty, SetQty] = useState(100);

  const securitySelected = async (e) => {
    const selectedSecurity = e.target.value;
    const company = FullSecurityData.find((i) => i.Symbol === selectedSecurity);
    const query = `https://deciderse.netlify.app/.netlify/functions/quotes?sid=${
      company.sid
    }&date=${new Date().toISOString()}`;
    const res = await fetch(query);
    const resdata = await res.json();
    const securityData = { ...resdata[0], Symbol: selectedSecurity };
    //set the state
    console.log(securityData);
    SetSecurityCurrent(securityData);
  };

  const qtyChanged = (e) => {
    SetQty(e.target.value);
  };

  const addShort = async (e) => {
    e.preventDefault();
    const shortPosition = {
      Type: "short",
      Symbol: SecurityCurrent.Symbol,
      Buy: SecurityCurrent.price,
      Qty: Qty,
      SID: SecurityCurrent.sid,
      Position: "open",
    };
    const dataString = JSON.stringify(shortPosition);
    const encodedData = window.btoa(dataString);
    await fetch(
      `https://deciderse.netlify.app/.netlify/functions/trade?method=AddShortPosition&data=${encodedData}`
    );
    SetNotification({
      message:'Shorted!',
      type:'success'
    });
   
  };

  
  const addDelivery = async (e) => {
    e.preventDefault();
    const shortPosition = {
      Type: "delivery",
      Symbol: SecurityCurrent.Symbol,
      Buy: SecurityCurrent.price,
      Qty: Qty,
      SID: SecurityCurrent.sid,
      Position: "open",
    };
    const dataString = JSON.stringify(shortPosition);
    const encodedData = window.btoa(dataString);
    await fetch(
      `https://deciderse.netlify.app/.netlify/functions/trade?method=AddDeliveryPosition&data=${encodedData}`
    );
    SetNotification({
      message:'Purched!',
      type:'success'
    });
   
  };

  const showCompaniesWithNoSIDs = (e) => {
    e.preventDefault();
    const CompaniesMissingInDataJS=[]; 
    const CompaniesMissingSIDsInDataJS=[]; 
    AllCos.forEach(i => {
       const sec= FullSecurityData.find(j => j.Symbol === i.Symbol);
       if(sec===undefined){
        CompaniesMissingInDataJS.push(i.Symbol);
       }
       else{
        if(!sec.sid){
          CompaniesMissingSIDsInDataJS.push(sec);
        }
       }
      }
    );
    console.log('Companies missing in Data.js :');
    console.log(CompaniesMissingInDataJS);
    console.log('Companies missing SIDs in Data.js :');
    console.log(CompaniesMissingSIDsInDataJS);
   // console.log(NoSIDCompanies);
   // SetNoSIDsCompanies(NoSIDCompanies);
  
  };

  return (
    <React.Fragment>
        
      <form style={{ maxWidth: "20em" }}>
        <div className="form-group">
          <label htmlFor="Security">Select Security</label>
          <select
            className="form-control"
            id="Security"
            onChange={securitySelected}
          >
            {AllCos.sort((a, b) =>
              a.Symbol < b.Symbol ? -1 : a.Symbol > b.Symbol ? 1 : 0
            ).map((i, index) => (
              <option key={index}>{i.Symbol}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="h5 text-success">
            Current Price: {SecurityCurrent.price}{" "}
          </label>
          <br />
          <label className="h5 text-success">High : {SecurityCurrent.h}</label>
          <br />
          <label className="h5 text-success">Low : {SecurityCurrent.l}</label>
          <br />
          <label className="h5 text-dark"> 1 LAC INR QTY : {(100000/SecurityCurrent.price).toFixed(0)}</label>
          <br />
          <label className="h5 text-info"> 1% UP SL : {(1.01*SecurityCurrent.price).toFixed(0)}</label>
          <br />
          <label className="h5 text-danger"> 1% DOWN SL : {(0.99*SecurityCurrent.price).toFixed(0)}</label>
          <br />
        </div>
        <div className="form-group">
          <label htmlFor="qty">Enter Qty</label>
          <input
            defaultValue={Qty}
            onChange={qtyChanged}
            type="number"
            className="form-control"
            id="qty"
            placeholder="Enter Qty"
          />
          <label className="h3 text-primary">
            Cost : Rs. {(Qty * SecurityCurrent.price).toFixed(2)}{" "}
          </label>
          <br />
        </div>
        <button type="input" onClick={addShort} className="btn btn-warning">
          Short
        </button>{" "}
        <button type="input" onClick={addDelivery} className="btn btn-success">
          Buy
        </button>{" "}
        &nbsp;
        <button
          type="input"
          onClick={showCompaniesWithNoSIDs}
          className="btn btn-info mt-5"
        >
          Show New CompanyNames/Missing SIDs
        </button>
      </form>
      <hr />
      <div>
        <h6>Companies with NO SIDs or companies missing in Data.js check console log using F12 after hitting above button</h6>
      </div>
      <Notifier data={Notification}/>
    </React.Fragment>
  );
};

export default Transact;
