export const NearLow=(data)=>{
    return data.sort((a,b)=>b.mcap-a.mcap)
               .slice(0,200)
               .sort((a,b)=>a.price/a.yearLow-b.price/b.yearLow)
}

export const MonthlyReturns=(data)=>{
    return data.sort((a,b)=>b.mcap-a.mcap)
               .slice(0,200)
               .sort((a,b)=>a.monthReturns-b.monthReturns)
}

export const YearlyReturns=(data)=>{
    return data.sort((a,b)=>b.mcap-a.mcap)
               .slice(0,200)
               .sort((a,b)=>a.yearReturns-b.yearReturns)
               
}

export const NiftyLow=(data)=>{
    return data.sort((a,b)=>b.mcap-a.mcap)
               .slice(0,50)
               .sort((a,b)=>a.price/a.yearLow-b.price/b.yearLow)
}

export const TopTwentyFive=(data)=>{
    return data.sort((a,b)=>b.mcap-a.mcap)
               .slice(0,25)
               .sort((a,b)=>a.yearReturns-b.yearReturns)
}


export const None=(data)=>{
    return [];
}
