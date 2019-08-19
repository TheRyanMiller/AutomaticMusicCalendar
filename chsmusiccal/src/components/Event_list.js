import React from "react";
import './Event_list.css';

const eventList = (props) =>{

  let addressItems = null;
  let i=0;
  if(props.event!==undefined){
    addressItems = props.event.addresses.map(a=>{

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
        {addressItems}
      </ul>
    </div>
  );
}

export default eventList;
