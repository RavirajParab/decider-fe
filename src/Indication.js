import React from "react";
export const Indication = (props) => {
    return props.data > 0 ? (<span className='text-success'>{props.data}%</span>) :
        (<span className='text-danger'>{props.data}%</span>)
}

export const RSIIndication = (props) => {
    
    const checkRSI =()=>{
        if(props.data<40){
            return (<span className='text-danger'><b>{props.data}</b></span>)
        }else if(props.data>39 && props.data<70){
           return (<span className='text-info'><b>{props.data}</b></span>)
        }else{
            return (<span className='text-success'><b>{props.data}</b></span>)
        }
    }
       
    return (<div>{checkRSI()}</div>)
}