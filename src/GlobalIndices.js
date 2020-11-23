import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Loading from "./Loading";


const GlobalIndices = (props) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const result = await Axios.get(
                "https://deciderse.netlify.app/.netlify/functions/globalindices"
            );
            setData(result.data);
        };
        fetchData();
    }, []);
    return (
        <div>
            {data.rsi ? (
                <Loading />
            ) : (
                    <div>
                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Index</th>
                                                    <th scope="col">Change</th>
                                                    <th scope="col">Region</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    data.map((i, idx) => <tr style={{color:i.Change<0?'red':'green'}}
                                                        key={idx}>
                                                        <th scope="row">{idx + 1}</th>
                                                        <td>{i.Index}</td>
                                                        <td>{i.Change}</td>
                                                        <td>{i.Region}</td>
                                                    </tr>)
                                                }
                                            </tbody>
                                        </table>
                    </div>
                )}
        </div>
    );
};

export default GlobalIndices;


