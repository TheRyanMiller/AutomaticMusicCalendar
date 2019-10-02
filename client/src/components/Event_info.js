import React from "react";
//import './Event_detail.css';
import './Event_list.css';

const eventDetail = (props) => {
    let detail = "";
    let ticketLink = (<a href={props.event.ticketLink} target="_blank" >Ticket Link</a>)
    let date = (<span>Date: {props.event.dateDOW}, {props.event.dateMMM} {props.event.dateDD} </span>)
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
            {props.event.eventDate ? date : "" } <br />
            {props.event.ticketLink ? ticketLink : ""} <br />
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
