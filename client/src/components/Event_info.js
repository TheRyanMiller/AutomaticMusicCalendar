import React from "react";
//import './Event_detail.css';
import './Event_list.css';

const eventDetail = (props) => {
    let detail = "";
    let addRsvpButton = (
      <button
        onClick={()=>props.addRsvp(props.loggedInUser._id,props.event._id)}>
        RSVP
      </button>
    )
    let removeRsvpButton = (
      <button
        onClick={()=>props.removeRsvp(props.loggedInUser._id,props.event._id)}>
        Remove RSVP
      </button>
    )
    if(props.event.title){
      detail = (
        <div className="eventDetailMain">
          <div className="header">
            <h4>{props.event.title ? props.event.title : "" } </h4><br />
            Date: {props.event.eventDate ? props.event.eventDate : "" } <br />
            {props.event.ticketLink ? "Ticket Link: <br>"+props.event.ticketLink : ""} <br />
            {props.loggedInUser ? (props.event.isRsvpd ? removeRsvpButton : addRsvpButton) : "" }
              
          </div>
        </div>
      )
    }
    return (
      <div>{detail}</div>
    );
}

export default eventDetail;
