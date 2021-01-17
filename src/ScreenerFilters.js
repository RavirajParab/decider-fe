
export const StrategyOne=(data)=>{
    //More negativity is growing
    const filteredData = data.filter(i=>(
        i.PChange14<i.PChange5 
        && i.PChange<-1.
        && i.RSI!=undefined 
    ))
    .sort((a,b)=>a.IR-b.IR)   ;                                
    const fell = filteredData.filter(i=>(Number(i.Close)-Number(i.Open)<0));
    const HitRate =(fell.length*100/filteredData.length).toFixed(2);
    return {filteredData,HitRate};

    
}


export const StrategyTwo=(data)=>{
    //hasn't been beaten over long time yet
    const filteredData = data.filter(i=>
        i.Open<i.PClose && i.PIR>0 && i.PChange5>0
                                    )
                            .sort((a,b)=>a.IR-b.IR)  ;
                                                      
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
                                        i.PChange5<0 
                                        && i.PChange14>3
                                        && i.RSI!=undefined 
                                    )
                            .sort((a,b)=>a.IR-b.IR)   ;
                                                      
    const fell = filteredData.filter(i=>(Number(i.Close)-Number(i.Open)<0));
    const HitRate =(fell.length*100/filteredData.length).toFixed(2);
    return {filteredData,HitRate};
}

export const StrategyFive=(data)=>{
    return [];
}


export const StrategySix=(data)=>{
    //get the trend data
    const trends = JSON.parse(localStorage.getItem('trenddata'));
    if(trends.length){
        const sortedTrends = trends.sort((a,b)=>a.IR-b.IR);
        const First5MinsPlus = sortedTrends.filter(i=>(
              i.Trend.First5MinR<0  && 
              i.Trend.First15MinR<0 && 
              i.Trend.First15MinR<1.7*i.Trend.First5MinR
            ));
            
        console.log(First5MinsPlus);
        const fell = First5MinsPlus.filter(i=>i.IR<0);
        const HitRate =(fell.length*100/First5MinsPlus.length).toFixed(2);
        console.log(HitRate);
        //test execute pl
        const plArr = First5MinsPlus.map(i=>execute(i.SID));
        let totalPL=0;
        plArr.forEach(element => {
            totalPL+=element.PL
        });
        console.log(plArr);
        console.log(`Total PL is ${totalPL}`);
    }
    return [];
}

export const StrategySeven=(data)=>{
   // execute('BJFN');
    return [];
}

const execute =(sid)=>{
    let plData;
    //search the sid in the part
    for (let index = 0; index < 10; index++) {
        const ls = localStorage.getItem(`p${index}`);
        if(ls){
            const lso = JSON.parse(ls).data;
            //search in this array
            const currSID = lso.find(i=>i.SID===sid);
           // const dataPoints = currSID
            if(currSID){
                const timeline = currSID.action;
                const timeLineFinished= timeline.length >360?true:false;
                plData= {...getPL(timeline,timeLineFinished), SID:sid};
                break;
            }
        }
    }
    return plData;
}

const getPL =(timeline, dayEnded)=>{
    let sp;
    let sl;
    let tg;
    let cp;
    let pl;
    let qty;
    let slHitIndex=-1;
    let tgtHitIndex=-1;
    let time =null;
    if(timeline.length>24){
        sp = timeline[24].lp;
        qty = Math.round(100000/sp);
        sl = Math.round(sp+sp*0.015);
        tg = Math.round(sp-sp*0.015);
        for (let index = 0; index < timeline.length-15; index++) {
            if(index>24){
                //get the cp
                let item = timeline[index];
                if(item.lp>sl){
                    //SL hit
                    slHitIndex = index;
                    break;
                }
                if(item.lp<tg){
                    //target hit
                    tgtHitIndex = index
                    break;
                }
            } 
        }
       
    }
     
     if(slHitIndex==-1 & tgtHitIndex==-1){
         //LS or target didn't strike struck
         if(dayEnded){
            cp = timeline[timeline.length-20].lp;
            time = timeline[timeline.length-20].ts;
         }else{
            cp = timeline[timeline.length-1].lp;
            time = timeline[timeline.length-1].ts;
         }
     }else if(slHitIndex!==-1){
         //SL hit
        cp = timeline[slHitIndex].lp;
        time = timeline[slHitIndex].ts;
     }else{
          //target hit first
        cp = timeline[tgtHitIndex].lp;
        time = timeline[tgtHitIndex].ts;
     }
     //calculate the profit using the SP and CP
     pl = Math.round((sp-cp)*qty);
     return {
         PL : pl-85,//due to tax
         Time : (new Date(time)).toLocaleTimeString(),
         SL :sl,
         Target : tg
     }
}



export const None=(data)=>{
    return [];
}
