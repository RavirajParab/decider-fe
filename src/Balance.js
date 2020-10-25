import React,{useState,useEffect} from "react";
import Notifier from "./Notifier";

const Balance = () => {
  const [Balance, SetBalance] = useState(0);
  const [Notification,SetNotification]=useState({});
  useEffect(() => {
    const getBalance = async () => {
      const BalanceRes = await await fetch(
        `https://deciderse.netlify.app/.netlify/functions/trade?method=GetBalance&date=${new Date().toISOString()}`
      );
      const liveBalance = await BalanceRes.json();
      SetBalance(liveBalance);
    };
    getBalance();
  });

  const resetDeliveryPositions =async ()=>{
    await fetch(
      `https://deciderse.netlify.app/.netlify/functions/trade?method=DeleteClosedDeliveryPositions`
    );
    SetNotification({
      message:'Delivery Positions cleared!',
      type:'success'
    });
  };
  
  const resetShortPositions =async ()=>{
    await fetch(
      `https://deciderse.netlify.app/.netlify/functions/trade?method=DeleteClosedShortPositions`
    );
    SetNotification({
      message:'Short Positions cleared!',
      type:'success'
    });
  };

  return (
    <React.Fragment>
      <span className="h3 text-muted">Balance</span>
      <hr />
      <span className="h3 text-success">{Math.round(Balance)}</span> <br/>
      <button className="btn btn-info" onClick={resetShortPositions}> Reset Shorts</button>
      <button className="btn btn-success ml-3" onClick={resetDeliveryPositions}> Reset Delivery</button>
      <br/>
        <Notifier style={{ 'display':'none'}} data={Notification}/>
    </React.Fragment>
  );
};

export default Balance;
