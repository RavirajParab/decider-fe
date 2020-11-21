import React from "react";
const Indication = (props) => {
    return props.data > 0 ? (<span className='text-success'>{props.data}%</span>) :
        (<span className='text-danger'>{props.data}%</span>)
}

export default Indication;