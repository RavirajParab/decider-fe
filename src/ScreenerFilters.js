

export const StrategyOne=(data)=>{
    //weak and opened below previous close
            const filteredData = data.filter(i=>((Number(i.Open)<Number(i.PreviousClose))                                             
                                                &&(Number(i.Change5)<2)
                                                && i.RSI!=undefined 
                                                ))
                                    .sort((a,b)=>a.IR-b.IR)                               
            const fell = filteredData.filter(i=>(Number(i.Close)-Number(i.Open)<0));
            const HitRate =(fell.length*100/filteredData.length).toFixed(2);
            return {filteredData,HitRate};
}


export const StrategyTwo=(data)=>{
    //hasn't been beaten over long time yet
    const filteredData = data.filter(i=>i.BadDayBefore>18 
                                      && i.RSI!=undefined 
                                      && i.GoodDayBefore<18
                                      && i.PIR>0.5
                                    )
                            .sort((a,b)=>a.IR-b.IR)  ;
                            console.log(filteredData);                             
    const fell = filteredData.filter(i=>(Number(i.Close)-Number(i.Open)<0));
    const HitRate =(fell.length*100/filteredData.length).toFixed(2);
    return {filteredData,HitRate};
}


export const StrategyThree=(data)=>{
    //blasted yesterday with high intra day gain
    const filteredData = data.filter(i=>
                                        i.PIR>2.2
                                        && i.RSI!=undefined 
                                    )
                            .sort((a,b)=>a.IR-b.IR)                               
    const fell = filteredData.filter(i=>(Number(i.Close)-Number(i.Open)<0));
    const HitRate =(fell.length*100/filteredData.length).toFixed(2);
    return {filteredData,HitRate};
}


export const StrategyFour=(data)=>{
    //losing stem in last 5 days
    const filteredData = data.filter(i=>
                                        i.Change5<0 
                                        && i.Change14>3
                                        && i.RSI!=undefined 
                                    )
                            .sort((a,b)=>a.IR-b.IR)   ;
                            console.log(filteredData);                            
    const fell = filteredData.filter(i=>(Number(i.Close)-Number(i.Open)<0));
    const HitRate =(fell.length*100/filteredData.length).toFixed(2);
    return {filteredData,HitRate};
}



export const None=(data)=>{
    return [];
}
