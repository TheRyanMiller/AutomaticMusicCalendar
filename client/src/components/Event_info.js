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
    if(props.event.locAcronym === "ra") img=raimg;
    if(props.event.locAcronym === "ph") img=phimg;
    if(props.event.locAcronym === "tr") img=trimg;
    if(props.event.locAcronym === "mf") img=mfimg;
    let title;
    let showTime = (<span>{props.event.showTime ? props.event.showTime : ""} <br /></span>);
    if(props.event.showUrl || !props.event.showUrl===""){
      title = (<span className="center"><h3><a href={props.event.showUrl} target="_blank" >{props.event.title}</a></h3><br /><br /></span>);
    }
    else{
      title = (<h3 className="center">{props.event.title ? props.event.title : "" } <br /><br /></h3>);
    }
    if(props.event.showTime && props.event.doorsTime){
      showTime = (<span className="small">Show: {props.event.showTime} (doors: {props.event.doorsTime}) <br /></span>);
    }
    let date = (<span >{props.event.dateDOW}, {props.event.dateMMM} {props.event.dateDD}, {props.event.dateYYYY} <br /></span>)
    let fee = (<span className="small">Fee: {props.event.fee} <br /></span>);
    let opener = (<span>Opener(s): {props.event.opener} <br /></span>);

    let ticketLink = (<span className="small"><a href={props.event.ticketLink} target="_blank" >Ticket Link</a><br /></span>)
    let fbLink = (<span className="small"><a href={props.event.fbLink} target="_blank" >Facebook Event Link</a><br /></span>)
    let links = (<span></span>);
    if(props.event.ticketLink){
      if(props.event.fbLink){
        links = (<span className="small"><a href={props.event.ticketLink} target="_blank" >
          Ticket Link</a>  //  <a href={props.event.fbLink} target="_blank" >Facebook Event
            </a>
          </span>
        )
      }
      else{
        links = (<span className="small"><a href={props.event.ticketLink} target="_blank" >Ticket Link</a><br /></span>)
      }
    }
    else if (props.event.fbLink){
      links = (<span className="small"><a href={props.event.fbLink} target="_blank" >Facebook Event</a><br /></span>)
    }
    
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
            {title}
            {props.event.eventDate ? date : "" }
            {showTime}
            {props.event.opener ? opener : "" } 
            {props.event.fee ? fee : ""}
            {links}
                       
            {props.loggedInUser ? (props.event.isRsvpd ? removeRsvpButton : addRsvpButton) : "" }
            
        </div>
      )
    }
    return (
      <div>{detail}</div>
    );
}

export default eventDetail;
