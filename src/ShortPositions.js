import React, { useState, useEffect } from "react";

const ShortPositions = (props) => {
 
  const [ShortPositions, SetShortPositions] = useState([]);
  const [TotalPL, SetTotalPL]=useState(0);
  useEffect(()=>{
    const getShortPositions=async ()=>{
        const shortPositionsRes = await fetch(`https://fndecider.azurewebsites.net/api/Short?method=GetShortPositions&date=${new Date().toISOString()}`);
        const shortPositions = await shortPositionsRes.json();
        const SIDs=shortPositions.map(i=>i.SID).join(',');
        const LiveQuotesRes = await fetch(`https://fndecider.azurewebsites.net/api/Quotes?sid=${SIDs}&date=${new Date().toISOString()}`);
        const LiveData = await LiveQuotesRes.json();
        const NewShortPositions = LiveData.map((i,index)=>{
          return {...shortPositions[index],
                  mr:Number(((i.h-i.o)*100/i.o).toFixed(2)),
                  cp:i.price,pl:Math.round((shortPositions[index].Buy-i.price)*shortPositions[index].Qty)}
        });
        let pl=0;
        NewShortPositions.forEach(element => {
          pl+=element.pl;
        });
        console.log(NewShortPositions);
        SetTotalPL(pl);    
        SetShortPositions(NewShortPositions);
        }
        getShortPositions();
  },[]);

  //change PL
  const evaluatePL=async ()=>{
    const SIDs=ShortPositions.map(i=>i.SID).join(',');
    const LiveQuotesRes = await fetch(`https://fndecider.azurewebsites.net/api/Quotes?sid=${SIDs}&date=${new Date().toISOString()}`);
    const LiveData = await LiveQuotesRes.json();
    const NewShortPositions = LiveData.map((i,index)=>{
      return {...ShortPositions[index],
              cp:i.price,pl:Math.round((ShortPositions[index].Buy-i.price)*ShortPositions[index].Qty)}
    });
    let pl=0;
    NewShortPositions.forEach(element => {
      pl+=element.pl;
    });
    console.log(NewShortPositions);
    SetTotalPL(pl);    
    SetShortPositions(NewShortPositions);
  }

  const coverUp=async (security)=>{
    const coverShort ={
      Symbol :security.Symbol,
      SellPrice: security.cp
  }
    console.log(coverShort);
    const dataString= JSON.stringify(coverShort);
    const encodedData= window.btoa(dataString);
    await fetch(`https://fndecider.azurewebsites.net/api/Short?method=CoverShortPosition&data=${encodedData}`);
    //remove the entry from short positions
    const copy_ShortPositions=[...ShortPositions].filter(i=>i.Symbol!==security.Symbol);
    SetShortPositions(copy_ShortPositions);
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
        {ShortPositions.map((i, index) => (
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

export default ShortPositions;
