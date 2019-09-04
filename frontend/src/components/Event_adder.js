import React from "react";
//import './Event_detail.css';
import './Event_list.css';
import EventList from './Event_list';

const eventDetail = (props) => {
    return (
      <div className="eventDetailMain">
        <div className="header">
            <input placeholder="Enter your address / public key"
             >  
            </input>
            <button
              onClick={()=>props.addressAdd(this._inputElement,props.event.id)}

              >
              Add
            </button>
        </div>
        <EventList />
      </div>
    );
}

export default eventDetail;
