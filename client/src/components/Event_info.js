import React from "react";
//import './Event_detail.css';
import './Event_list.css';
import './Event_info.css';
import mfimg from '../assets/sizedlogos/mf.png';
import phimg from '../assets/sizedlogos/ph.png';
import trimg from '../assets/sizedlogos/tr.png';
import raimg from '../assets/sizedlogos/ra.png';

const eventDetail = (props) => {
    let detail = "";
    let img;
    if(props.event.locAcronym == "ra") img=raimg;
    if(props.event.locAcronym == "ph") img=phimg;
    if(props.event.locAcronym == "tr") img=trimg;
    if(props.event.locAcronym == "mf") img=mfimg;
    let ticketLink = (<span><a href={props.event.ticketLink} target="_blank" >Ticket Link</a><br /></span>)
    let facebookLink = (<a href={props.event.facebookLink} target="_blank" >Facebook Event Link</a>)
    let date = (<span className="center">{props.event.dateDOW}, {props.event.dateMMM} {props.event.dateDD}, {props.event.dateYYYY} </span>)
    let fee = (<span>Fee: {props.event.fee}</span>);
    let opener = (<span>{props.event.opener} <br /><br /></span>);
    let showTime = (<span></span>);
    let logo = (<span className="center"><img className="center" src={img} alt="Venue Logo"></img></span>);
    let br = (<span><br /></span>);
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
          {logo}<br />
            {props.event.eventDate ? date : "" }
            
            <h3>{props.event.title ? props.event.title : "" } </h3>
            {props.event.opener ? opener : br } 
            {props.event.fee ? fee : "Fee: N/A"} <br />
            {props.event.ticketLink ? ticketLink : ""}
            {props.event.facebookLink ? facebookLink : "Facebook Link: N/A"} <br />
            {props.event.showTime ? showTime : "Show Time: N/A"} <br />            
            {props.loggedInUser ? (props.event.isRsvpd ? removeRsvpButton : addRsvpButton) : "" }
            
        </div>
      )
    }
    return (
      <div>{detail}</div>
    );
}

export default eventDetail;
