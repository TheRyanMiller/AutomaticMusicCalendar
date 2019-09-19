import React from "react";
//import './Event_detail.css';
import './Event_list.css';

const eventDetail = (props) => {
    let detail = "";
    if(props.event.title){
      detail = (
        <div className="eventDetailMain">
          <div className="header">
            <h4>{props.event.title ? props.event.title : "" } </h4><br />
            Date: {props.event.eventDate ? props.event.eventDate : "" } <br />
            {/*Conditional Fields*/}
            {props.event.ticketLink ? "Ticket Link: <br>"+props.event.ticketLink : ""} <br />
            {console.log(props.event)}
              <button
                onClick={()=>props.addRsvp("5d7eed9053396b2671e1314c",props.event._id)}
                >
                RSVP
              </button>
              <button
                onClick={()=>props.removeRsvp(this._inputElement,props.event._id)}
                >
                Remove RSVP
              </button>
          </div>
        </div>
      )
    }
    return (
      <div>{detail}</div>
    );
}

export default eventDetail;
