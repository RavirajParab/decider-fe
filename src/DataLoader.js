import React, { useState } from "react";
import Axios from 'axios';
import LocalSIDData from "./data";

const DataLoader = (props) => {
  const [DataLoad,setDataLoad] = useState('Initialized!')
  
  //fetch the RSI data
  const fetchData = async () => {
    const result = await Axios.get(
      "https://deciderse.netlify.app/.netlify/functions/topcompanies"
    );
    result.data.pop();  
    const rsiData = result.data
                          .filter(i=>i!==null)
                          .filter(i=>i!==undefined)
                          .map(m=>{
                            const co = LocalSIDData.filter(k=>k.Symbol===m.Symbol);
                            let sidc='NA';
                            if(co.length){
                               if(co[0]){
                                 sidc =co[0].sid;
                               }
                            }
                            return {...m,sid:sidc}
                          })
                          .sort((a, b) => a.RSI - b.RSI);
      
    //set the data in the local storage
    localStorage.removeItem('allcos');
    localStorage.setItem('allcos',JSON.stringify(rsiData));
  };


  //reprocess the data from localstorage and reset it
   const processData = async ()=>{
    try{
      setDataLoad('Data collecting started....');
      await fetchData();
      setDataLoad('Data collecting finished!');
    }catch(err){
       console.log(err);
    }
  }
  return (  
    <div>
      <button className="btn btn-info ml-2" onClick={processData}>Fetch latest Data</button><br/>
      <span className="pl-4">{DataLoad}</span>
    </div>
  );
};

export default DataLoader;
