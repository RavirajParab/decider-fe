import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Loading from "./Loading";
import { Indication } from "./Indication";
import { RSIIndication } from "./Indication";


const Indices = (props) => {
    const AllCosString = localStorage.getItem("allcos");
    const AllCos = JSON.parse(AllCosString);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await Axios.get(
                "https://deciderse.netlify.app/.netlify/functions/indices"
            );
            //add RSI data
            const indiceData = result.data.map(x => {
                const companies_copy = x.Companies.map(n => {
                    const co = AllCos.filter(t => t.Symbol === n.Symbol);
                    if (co.length) {                    
                        return { ...n, RSI: co[0].RSI, Change: co[0].Change, Close:Number(co[0].Close) }
                    } else {
                        return { ...n, RSI: 'NA', Change: 0 }
                    }
                });
                return { ...x, Companies: companies_copy }
            });


            setData(indiceData);
        };
        fetchData();
    }, []);

    //generateID
    const generateID = (id, prefix, withHash) => withHash ? `#${prefix}${id}` : `${prefix}${id}`;

    return (
        <div>
            {data.rsi ? (
                <Loading />
            ) : (
                    <div>

                        <div className="accordion" id="indexAccordion">
                            {data.map((info, idx) => <div className="card" key={idx}>
                                <div className="card-header"
                                    id={generateID(info.IndexData.IndexID, 'Heading', false)}
                                    data-toggle="collapse"
                                    data-target={generateID(info.IndexData.IndexID, 'COS', true)}
                                    aria-expanded="false" aria-controls={generateID(info.IndexData.IndexID, 'COS')}>
                                    <p className="h4">{idx + 1}. {info.IndexData.IndexName}</p>
                                    <p className="h6 ml-4"> Today : <Indication data={info.IndexData.IndexChange} /> </p>
                                    <p className="h6 ml-4"> Bullish : <Indication data={info.IndexData.Bullishness} /> </p>
                                    <p className="h6 ml-4"> Rise from Lows : <Indication data={info.IndexData.Rise} /></p>
                                </div>

                                <div id={generateID(info.IndexData.IndexID, 'COS')} className="collapse" data-parent="#indexAccordion"
                                    aria-labelledby={generateID(info.IndexData.IndexID, 'Heading', false)}>
                                    <div className="card-body">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    {/* <th scope="col">#</th> */}
                                                    <th scope="col">Symbol</th>
                                                    <th scope="col">SL</th>
                                                    <th scope="col">Target</th>
                                                    <th scope="col">Change</th>
                                                    <th scope="col">RSI</th>
                                                    <th scope="col">Rise</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    info.Companies.sort((m,n)=>(m.Change-n.Change)).filter(k=>k.RSI!=='NA').map((coinfo, idxx) => <tr key={idxx}>
                                                        {/* <th scope="row">{idxx + 1}</th> */}
                                                        <td><a
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            href={
                                                                "https://in.tradingview.com/chart/?symbol=NSE%3A" +
                                                                coinfo.Symbol
                                                            }
                                                        >
                                                            <span style={{ color: coinfo.Change < 0 ? 'red' : 'green' }}>{coinfo.Symbol}</span>

                                                        </a> {coinfo.Close?"("+(Math.round(100000/coinfo.Close))+")":null}</td>
                                                        <td>{coinfo.Close?(coinfo.Close*0.005).toFixed(1):"-"}</td>
                                                        <td>{coinfo.Close?(coinfo.Close*0.009).toFixed(1):"-"}</td>
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


