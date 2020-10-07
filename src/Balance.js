import React,{useState,useEffect} from "react";

const Balance = () => {
  const [Balance, SetBalance] = useState(0);
  useEffect(() => {
    const getBalance = async () => {
      const BalanceRes = await await fetch(
        `https://fndecider.azurewebsites.net/api/Short?method=GetBalance&date=${new Date().toISOString()}`
      );
      const liveBalance = await BalanceRes.json();
      SetBalance(liveBalance);
    };
    getBalance();
  });
  return (
    <React.Fragment>
      <span className="h3 text-muted">Balance</span>
      <hr />
      <span className="h3 text-success">{Math.round(Balance)}</span>
    </React.Fragment>
  );
};

export default Balance;
