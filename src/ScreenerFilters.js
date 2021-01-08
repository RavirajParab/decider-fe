

export const StrategyOne=(data)=>{
    //weak and opened below previous close
            const filteredData = data.filter(i=>((Number(i.Open)<Number(i.PreviousClose))                                             
                                                &&(Number(i.Change5)<2)
                                                ))
                                    .sort((a,b)=>a.IR-b.IR)                               
            const fell = filteredData.filter(i=>(Number(i.Close)-Number(i.Open)<0));
            const HitRate =(fell.length*100/filteredData.length).toFixed(2);
            return {filteredData,HitRate};
}


export const StrategyTwo=(data)=>{
    const filteredData = data.filter(i=>i.SMA5<i.SMA14
                                    )
                            .sort((a,b)=>a.IR-b.IR)                               
    const fell = filteredData.filter(i=>(Number(i.Close)-Number(i.Open)<0));
    const HitRate =(fell.length*100/filteredData.length).toFixed(2);
    return {filteredData,HitRate};
}


export const StrategyThree=(data)=>{
    //blasted yesterday with high intra day gain
    const filteredData = data.filter(i=>
                                        i.PIR>2.2
                                    )
                            .sort((a,b)=>a.IR-b.IR)                               
    const fell = filteredData.filter(i=>(Number(i.Close)-Number(i.Open)<0));
    const HitRate =(fell.length*100/filteredData.length).toFixed(2);
    return {filteredData,HitRate};
}


export const StrategyFour=(data)=>{
    //losing stem in last 5 days
    const filteredData = data.filter(i=>
                                        i.Change5<0 && i.Change14>3
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
