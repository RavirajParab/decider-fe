import React, { useState, useEffect } from "react";

const DeliveryPositions = (props) => {
 
  const [DeliveryPositions, SetDeliveryPositions] = useState([]);
  const [TotalPL, SetTotalPL]=useState(0);
  useEffect(()=>{
    const getDeliveryPositions=async ()=>{
        const DeliveryPositionsRes = await fetch(`https://deciderse.netlify.app/.netlify/functions/trade?method=GetDeliveryPositions&date=${new Date().toISOString()}`);
        const DeliveryPositions = await DeliveryPositionsRes.json();
        const SIDs=DeliveryPositions.map(i=>i.SID).join(',');
        const LiveQuotesRes = await fetch(`https://deciderse.netlify.app/.netlify/functions/quotes?sid=${SIDs}&date=${new Date().toISOString()}`);
        const LiveData = await LiveQuotesRes.json();
        const NewDeliveryPositions = LiveData.map((i,index)=>{
          return {...DeliveryPositions[index],
                  mr:Number(((i.h-i.o)*100/i.o).toFixed(2)),
                  cp:i.price,pl:Math.round((i.price-DeliveryPositions[index].Buy)*DeliveryPositions[index].Qty)}
        });
        let pl=0;
        NewDeliveryPositions.forEach(element => {
          pl+=element.pl;
        });
        console.log(NewDeliveryPositions);
        SetTotalPL(pl);    
        SetDeliveryPositions(NewDeliveryPositions);
        }
        getDeliveryPositions();
  },[]);

  //change PL
  const evaluatePL=async ()=>{
    const SIDs=DeliveryPositions.map(i=>i.SID).join(',');
    const LiveQuotesRes = await fetch(`https://deciderse.netlify.app/.netlify/functions/quotes?sid=${SIDs}&date=${new Date().toISOString()}`);
    const LiveData = await LiveQuotesRes.json();
    const NewDeliveryPositions = LiveData.map((i,index)=>{
      return {...DeliveryPositions[index],
              cp:i.price,pl:Math.round((i.price-DeliveryPositions[index].Buy)*DeliveryPositions[index].Qty)}
    });
    let pl=0;
    NewDeliveryPositions.forEach(element => {
      pl+=element.pl;
    });
    console.log(NewDeliveryPositions);
    SetTotalPL(pl);    
    SetDeliveryPositions(NewDeliveryPositions);
  }

  const coverUp=async (security)=>{
    const coverDelivery ={
      Symbol :security.Symbol,
      SellPrice: security.cp
  }
    console.log(coverDelivery);
    const dataString= JSON.stringify(coverDelivery);
    const encodedData= window.btoa(dataString);
    await fetch(`https://deciderse.netlify.app/.netlify/functions/trade?method=CoverDeliveryPosition&data=${encodedData}`);
    //remove the entry from short positions
    const copy_DeliveryPositions=[...DeliveryPositions].filter(i=>i.Symbol!==security.Symbol);
    SetDeliveryPositions(copy_DeliveryPositions);
  }

  return (
    <div>
    
    <span className={TotalPL>0?'h3 text-success':'h3 text-danger'}>Profit {TotalPL}</span>
    <button className="btn btn-warning float-right" onClick={evaluatePL}>Refresh</button>
    {" "}
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">MR</th>
          <th scope="col">BP</th>
          <th scope="col">CP</th>
          <th scope="col">PL</th>
        </tr>
      </thead>
      <tbody>
        {DeliveryPositions.map((i, index) => (
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
                {i.Symbol} 
                ({i.Qty})
              </a>{" "}
              <button className="btn btn-warning btn-sm" onClick={coverUp.bind(this,i)}>sq</button>
            </td>
            <td>{i.mr}</td>
            <td>{i.Buy}</td>
              <td>{i.cp}</td>
              <td className={i.pl>0?'h5 text-success':'h5 text-danger'}>{i.pl}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default DeliveryPositions;
