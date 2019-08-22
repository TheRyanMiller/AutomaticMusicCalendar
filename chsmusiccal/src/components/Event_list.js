import React from "react";
import './Event_list.css';

const eventList = (props) =>{

  let eventItems = null;
  let i=0;
  if(props.events!==undefined){
    eventItems = props.events.map(a=>{
      return (
        <li onClick={()=>props.addressDelete(a.address,props.event.id)} key={i++} >
          {a.address}
        </li>
      )
    });
  }

  return (
    <div className="AddressListDiv">
      <ul className="theList">
        {eventItems}
      </ul>
    </div>
  );
}

export default eventList;
