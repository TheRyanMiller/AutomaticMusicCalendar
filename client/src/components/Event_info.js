import React from "react";
//import './Event_detail.css';
import './Event_list.css';
import './Event_info.css';
import Aux from '../hoc/Auxx';

const eventDetail = (props) => {
    let detail = "";
    let ticketLink = (<a href={props.event.ticketLink} target="_blank" >Ticket Link</a>)
    let facebookLink = (<a href={props.event.facebookLink} target="_blank" >Facebook Event Link</a>)
    let date = (<span>{props.event.dateDOW}, {props.event.dateMMM} {props.event.dateDD} </span>)
    let fee = (<span>Fee: {props.event.fee}</span>);
    let opener = (<span>{props.event.opener} <br /><br /></span>);
    let showTime = (<span></span>);
    let br = (<br />);
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
            {props.event.eventDate ? date : "" }
            <h3>{props.event.title ? props.event.title : "" } </h3>
            {props.event.opener ? opener : br } 
            {props.event.ticketLink ? ticketLink : "Ticket Link: N/A"} <br />
            {props.event.facebookLink ? facebookLink : "Facebook Link: N/A"} <br />
            {props.event.showTime ? showTime : "Show Time: N/A"} <br />

            {props.event.fee ? fee : "Fee: N/A"} <br />
            
            
            {props.loggedInUser ? (props.event.isRsvpd ? removeRsvpButton : addRsvpButton) : "" }
            
        </div>
      )
    }
    return (
      <div>{detail}</div>
    );
}

export default eventDetail;
