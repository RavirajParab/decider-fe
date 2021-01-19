/* Executor properties */
let timeOfShorting = 30; //0 is 9.15 Am, 24 is 9.39Am, 30 is 9.45Am, 45 is 10Am
//ideal time to short is 9.45Am
let Money =25000; //Amount to be invested
let Tax = Math.round(Money*0.00085); //Taxes
let SLTgtPerc = 1.5/100;    //SL or target percentage
/* Executor properties */

export const StrategyOne=(data)=>{
    //More negativity is growing
    const filteredData = data.filter(i=>(
        i.PChange14<i.PChange5 
        && i.PChange<-1.
        && i.RSI!=undefined 
    ))
    .sort((a,b)=>a.IR-b.IR); 
    //pL execution stub starts here
   
        //pL execution stub ends here
    return {
        data : filteredData,
        refreshRequired : true
    }
}


export const StrategyTwo=(data)=>{
    //hasn't been beaten over long time yet
    const filteredData = data.filter(i=>
        i.Open<i.PClose && i.PIR>0 && i.PChange5>0
                                    )
                            .sort((a,b)=>a.IR-b.IR)  ;
                            return {
                                data : filteredData,
                                refreshRequired : true
                            }
}

export const StrategyThree=(data)=>{
    //blasted yesterday with high intra day gain
    const filteredData = data.filter(i=>
                                        i.PIR>2.2
                                        && i.RSI!=undefined 
                                    )
                            .sort((a,b)=>a.IR-b.IR)                               
                            return {
                                data : filteredData,
                                refreshRequired : true
                            }
}


export const StrategyFour=(data)=>{
    //losing stem in last 5 days
    const filteredData = data.filter(i=>
                                        i.PChange5<0 
                                        && i.PChange14>3
                                        && i.RSI!=undefined 
                                    )
                            .sort((a,b)=>a.IR-b.IR)   ;
                            return {
                                data : filteredData,
                                refreshRequired : true
                            }
}

export const StrategyFive=(data)=>{
    //get the trend data
    const trends = JSON.parse(localStorage.getItem('trenddata'));
    if(trends.length){
        const sortedTrends = trends.sort((a,b)=>a.IR-b.IR);
        const First5MinsPlus = sortedTrends.filter(i=>(
              i.Trend.First5MinR<0  && 
              i.Trend.First15MinR<0 && 
              i.Trend.First15MinR<1.7*i.Trend.First5MinR
            ));
       //merge the Symbol data;
       const allCos = JSON.parse(localStorage.getItem('allcos'));
       const filteredData = First5MinsPlus.map(i=>{
           const co = allCos.find(c=>c.sid==i.SID);
           return {...co,...i}
       });
       return {
        data : filteredData,
        refreshRequired : false
    }
    }
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
    
    if(timeline.length>timeOfShorting){
        sp = timeline[timeOfShorting].lp;
        qty = Math.round(Money/sp);
        sl = Math.round(sp+sp*SLTgtPerc);
        tg = Math.round(sp-sp*SLTgtPerc);
        for (let index = 0; index < timeline.length-15; index++) {
            if(index>timeOfShorting){
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
         PL : pl-Tax,//due to tax
         Time : (new Date(time)).toLocaleTimeString(),
         SL :sl,
         Qty : qty,
         Target : tg
     }
}

export const evaluatePLMoney =(filteredData)=>{
    const plArr = filteredData.map(i=>execute(i.sid));
    let totalPL=0;
    plArr.forEach(element => {
        totalPL+=element.PL
    });
    //console.log(plArr);
    //console.log(`Total PL is ${totalPL}`);
    return {
        Executions : plArr,
        NetPLPostTax : totalPL
    }
    
}


export const None=(data)=>{
    return [];
}
