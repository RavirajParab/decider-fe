import React, { useState } from "react";
import Axios from 'axios';
import LocalSIDData from "./data";

const TickerTrendLoader = (props) => {
  const [DataLoad,setDataLoad] = useState('Initialized!');
  const sidsArr =[
    `ADIA,ARTI,ACC,ADNA,ADAI,ADTB,APSE,ADEL,ABOT,ADAG,AMAR,AJPH,APLO,ABUJ,ALKE,ALEM,APLH,AXBK,ARBN`.split(','),
    `ASPN,AUFI,ASOK,BFRG,BJFS,BRGR,BATA,BAJA,BLKI,BANH,BOI,BOB,BBRM,BJFN,BJAT,BAJE,BRIT,BION,BHEL,BOSH,BRTI`.split(','),
    `CNBK,BPCL,CADI,DABU,DALB,CUMM,CROP,CTBK,AVEU,DLF,EDEL,REDY,EMAM,DIVI,EICH,ESCO,FRTL,GAIL`.split(','),
    `FOHE,FED,ENDU,EXID,GODE,GLEN,GENA,GOCP,GGAS,HVEL,GRAS,HALC,HUDC,HPCL,HDFC,HZNC,HDBK,HDFL,INBF,HCLT,HLL`.split(','),
    `HROM,HDFA,ICBK,INGL,ICIR,IHTL,INIR,ICCI,ITC,BHRI,INFY,INBK,IOC,IPCA,JUBI,JSTL,JSWE,JNSP,KTKM,LTEH,PIRA`.split(','),
    `LTFH,LUPN,MRCO,MNFL,UNSP,MRTI,MOSS,MINT,MAXI,MBFL,MRF,MGAS,NAFL,NALU,NATP,MUTT,NTPC,PAGE,PWFC`.split(','),
    `PLNG,PNBK,PIIL,PFIZ,PREG,PGRD,POLC,RATB,SANO,SBI,SHCM,SBIL,SIEM,SRTR,SUN,SUTV,SRFL,TTPW,TISC,TTCH,SYNN`.split(','),
    `TACN,TAMO,TCS,TEML,TITN,TOPO,TORP,RELI,REXP,RECM,TRCE,SAIL,SBIC,TVSM,UBBW,TREN,UPLL`.split(','),
    `VARB,ULTC,VGUA,UNBK,WHIR,WIPR,VOLT,GSPT,COAL,CORF,CAST,COFO,COLG,CCRI,CHLA,LART,DLPA,MMFS,LRTI,LICH,MAHM`.split(','),
    `NIPF,NEST,INED,OILI,ORCL,NMDC,ONGC,ZEE,YESB,PROC,PIDI,CESC,CIPL,GMRI,GODI,GODR,OEBO,VODA,IDFB,IGAS,INDB,ICIL`.split(',')
  ];
  //delay function
  function wait() {
    return new Promise( res => setTimeout(res, 10000) );
 }

 const getDRSIData =async (arr)=>{
   const url = `https://deciderse.netlify.app/.netlify/functions/drsi?sid=${arr.join(',')}`;
   const data = await Axios.get(url);
   return data.data;
 }
  
  //fetch the RSI data
  const fetchData = async () => {
    //loop through array
    sidsArr.forEach(async (i,index)=>{
      //check if the part exists in local storage
      const thisPart = localStorage.getItem(`p${index}`);
      if(!thisPart){
        try {
          //part does not exist only then add it
        console.log(`Missing part ${index} will be attempted`);
        const data = await getDRSIData(i);
        localStorage.setItem(`p${index}`,JSON.stringify({
          data : data
        }));
        setDataLoad(`Finished getting p${index} data`);
        await wait();
        } catch (error) {
          console.log(error);
          console.log(`Error occured while feteching p${index}`)
        }
      }
    });

    //check if all the parts are intact
    let check= true;
    sidsArr.forEach((i,index)=>{
      if(!localStorage.getItem(`p${index}`)){
        check = false;
      }
    });
    if(check){
      console.log(`All ticker parts are intact, hence mergering them`);
      const mergedData=[];
      sidsArr.forEach((i,index)=>{
        const data =JSON.parse(localStorage.getItem(`p${index}`));
        data.data.forEach(x=>{
          const {RSI:DRSI,IR,Price,SID,Trend} =x;
          mergedData.push({DRSI,IR,Price,SID, Trend});
        });
      });
      console.log(mergedData);
      localStorage.removeItem('trenddata');
      localStorage.setItem('trenddata',JSON.stringify(mergedData));
      console.log(`Trend Data is collated!`);
    }
  };

  //reset parts
  const resetTicker =()=>{
    console.log(`Resetting cached ticker data`);
    sidsArr.forEach((i,index)=>{
      localStorage.removeItem(`p${index}`);
    });
    console.log(`Cached ticker data is cleared!`);
  }


  //reprocess the data from localstorage and reset it
   const processData = async ()=>{
    try{
      setDataLoad('Data collecting started....');
      await fetchData();
      setDataLoad('Data collecting finished!');
    }catch(err){
       setDataLoad(err);
    }
  }
  return (  
    <table>
      <tbody>
      <tr>
        <td> <button className="btn btn-info ml-2" onClick={processData}>Get Trends</button><br/></td>
        <td><button className="btn btn-info ml-2" onClick={resetTicker}>Reset Ticker</button><br/></td>
      </tr>
      </tbody>
     
    </table>
   );
};

export default TickerTrendLoader;
