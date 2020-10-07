import React, { useState, useEffect } from "react";
import Axios from "axios";
import Loading from "./Loading";

const MMI = () => {
  const [data, setData] = useState({ mmi: {} });

  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios.get(
        "https://fndecider.azurewebsites.net/api/mmi"
      );
      setData(result.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      {data.mmi ? (
        <Loading />
      ) : (
        <h3 style={{ color: "#ccc" }}>{data.Current}</h3>
      )}
    </div>
  );
};

export default MMI;
