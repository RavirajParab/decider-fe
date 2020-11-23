import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Loading from "./Loading";
import {Indication} from "./Indication";
import {RSIIndication} from "./Indication";


const Indices = (props) => {
    const AllCosString = localStorage.getItem("allcos");
    const AllCos = JSON.parse(AllCosString);
    const [data, setData] = useState([]);
    const [databkp, setDataBkp] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [toggleState, setToggleState]=useState(false);
    const InSignificantIndexIDs=[13019,15501,14306,2346,14353,14303,2510,13602,2369,2371,2495,2907,13532]
    useEffect(() => {
        const fetchData = async () => {
            const result = await Axios.get(
                "https://deciderse.netlify.app/.netlify/functions/indices"
            );
            //add RSI data
            const indiceData = result.data.map(x=>{
                const companies_copy=x.Companies.map(n=>{
                    const co= AllCos.filter(t=>t.Symbol===n.Symbol);
                    if(co.length){
                        return {...n,RSI:co[0].RSI,Change:co[0].Change}
                    }else{
                        return {...n,RSI:'NA',Change:0}
                    } 
                });
                return {...x,Companies:companies_copy}
            });
            
            const filtered_indexData = indiceData.filter(i=>!InSignificantIndexIDs.includes(Number(i.IndexData.IndexID)));
            setData(filtered_indexData);
            setFilteredData(filtered_indexData);      
            setDataBkp(result.data);
        };
        fetchData();
    }, []);
    //toggle indices
    const toggleIndices=()=>{
        const data_copy =[...data];
        if(!toggleState){
            setData(databkp);
            setToggleState(!toggleState);
        }else{
            setData(filteredData);
            setToggleState(!toggleState);
        }
        
    }
    //generateID
    const generateID = (id, prefix, withHash) => withHash ? `#${prefix}${id}` : `${prefix}${id}`;

    return (
        <div>
            {data.rsi ? (
                <Loading />
            ) : (
                    <div>
                        <button className="btn btn-info" onClick={toggleIndices}>Toggle Indices</button>
                        <div className="accordion" id="indexAccordion">
                            {data.map((info, idx) => <div className="card" key={idx}>
                                <div className="card-header" 
                                     id={generateID(info.IndexData.IndexID,'Heading',false)}
                                     data-toggle="collapse" 
                                     data-target={generateID(info.IndexData.IndexID,'COS',true)} 
                                     aria-expanded="false" aria-controls={generateID(info.IndexData.IndexID,'COS')}>
                                    <p className="h4">{idx + 1}. {info.IndexData.IndexName}</p>
                                    <p className="h6 ml-4"> Today : <Indication data={info.IndexData.IndexChange} /> </p>
                                    <p className="h6 ml-4"> Bullish : <Indication data={info.IndexData.Bullishness} /> </p>
                                    <p className="h6 ml-4"> Rise from Lows : <Indication data={info.IndexData.Rise} /></p>
                                </div>

                                <div id={generateID(info.IndexData.IndexID,'COS')} className="collapse" data-parent="#indexAccordion"
                                     aria-labelledby={generateID(info.IndexData.IndexID,'Heading',false)}>
                                    <div className="card-body">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Symbol</th>                                                  
                                                    <th scope="col">Change</th>
                                                    <th scope="col">RSI</th>
                                                    <th scope="col">Rise</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    info.Companies.map((coinfo, idxx) => <tr key={idxx}>
                                                        <th scope="row">{idxx + 1}</th>
                                                        <td><a
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            href={
                                                                "https://in.tradingview.com/chart/?symbol=NSE%3A" +
                                                                coinfo.Symbol
                                                            }
                                                        >
                                                            <span style={{color:coinfo.Change<0?'red':'green'}}>{coinfo.Symbol}</span>
                                                            
                                                        </a></td>
                                                        <td><Indication data={coinfo.Change} /></td>
                                                        <td><RSIIndication data={coinfo.RSI} /></td>
                                                        <td><Indication data={coinfo.Rise} /></td>
                                                    </tr>)
                                                }

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>)}

                        </div>
                    </div>
                )}
        </div>
    );
};

export default Indices;


