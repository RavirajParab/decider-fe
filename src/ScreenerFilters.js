

export const StrategyOne=(data)=>{
            const filteredData = data.map(i=>{
                return {
                    ...i,
                    IntradayRise : i.Close-i.Open
                }
            }).filter(i=>((Number(i.Open)<Number(i.PreviousClose))
                                                &&(i.YesterdayChange>0)
                                                &&(Number(i.Change5)<2)
                                                ))
                                    .sort((a,b)=>a.IntradayRise-b.IntradayRise)                               
            const fell = filteredData.filter(i=>(Number(i.Close)-Number(i.Open)<0));
            const HitRate =(fell.length*100/filteredData.length).toFixed(2);
            return {filteredData,HitRate};
}


export const StrategyTwo=(data)=>{
    const filteredData = data.map(i=>{
        return {
            ...i,
            IntradayRise : i.Close-i.Open
        }
    }).filter(i=>(Number(i.Change14)<0)
                                        &&(Number(i.YesterdayChange)>1)
                                    )
                            .sort((a,b)=>a.IntradayRise-b.IntradayRise)                               
    const fell = filteredData.filter(i=>(Number(i.Close)-Number(i.Open)<0));
    const HitRate =(fell.length*100/filteredData.length).toFixed(2);
    return {filteredData,HitRate};
}


export const None=(data)=>{
    return [];
}
