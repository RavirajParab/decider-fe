import React, { useState, useEffect } from "react";
import Axios from "axios";
import Loading from "./Loading";

const AVD = () => {
  const [data, setData] = useState({ avd: {}});

  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get('https://deciderse.netlify.app/.netlify/functions/avd');
      setData(result.data);
    };
    fetchData();
  }, []);


  return (
   <div>
       {data.avd?<Loading/>:(<h3 style={{color:'#ccc'}}>{data}</h3>)}
   </div>
  );
};

export default AVD;
