import React from 'react';
import './EventDisplay.css';


const resultMesssage = (props) =>{

  let resultMesssage = "";
  if(props.hide){
    resultMesssage = (
      <span></span>
    )
  }
  else{
    resultMesssage = (
    <div className="fontColor">
      <br /><br /><br />
     <b>No results found.</b>
    </div>
    )
  }

  return resultMesssage;

}

export default resultMesssage;
