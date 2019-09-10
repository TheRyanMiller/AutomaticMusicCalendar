import React from "react";
//import './Event_detail.css';
import './Event_list.css';

const eventDetail = (props) => {
    return (
      <div className="eventDetailMain">
        <div className="header">
          <h4>{props.event.title} </h4><br />
          Date: {props.event.eventDate} <br />
          Ticket Link: {props.event.tiketLink} <br />
            <button
              onClick={()=>props.addressAdd(this._inputElement,props.event.id)}
              >
              RSVP
            </button>
            <button
              onClick={()=>props.addressAdd(this._inputElement,props.event.id)}
              >
              Remove RSVP
            </button>
        </div>
      </div>
    );
}

export default eventDetail;
