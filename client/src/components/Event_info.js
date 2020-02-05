import React from "react";
//import './Event_detail.css';
import './Event_list.css';
import './Event_info.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const eventDetail = (props) => {
    let title;
    let detail = (<span></span>);
    let date = (<span className="date">{props.event.dateDOW}, {props.event.dateMMM} {props.event.dateDD}, {props.event.dateYYYY} <br /></span>)
    let showTime = (<span>{props.event.showTime ? props.event.showTime : ""} <br /></span>);
    let opener = (<span className="openers">{props.event.opener} <br /></span>);
    if(props.event.showUrl || !props.event.showUrl===""){
      title = (<div className="titlespacing">
        {date}
        <span className="">
        <h3><a href={props.event.showUrl} target="_blank" rel="noopener noreferrer">{props.event.title}</a></h3>
        {opener}
        <br /><br /></span>
        </div>);
    }
    else{
      title = (<div className="titlespacing">
        {date}
        <h3 className="">{props.event.title ? props.event.title : "" } <br />
      {opener}
      <br /><br /></h3></div>);
    }
    if(props.event.showTime && props.event.doorsTime){
      showTime = (<span className="small">Show: {props.event.showTime} (doors: {props.event.doorsTime}) <br /></span>);
    }
    
    let fee = (<span className="small">Fee: {props.event.fee} <br /></span>);
    let links = (<span></span>);
    if(props.event.ticketLink){
      if(props.event.fbLink){
        links = (<span className="small"><a href={props.event.ticketLink} rel="noopener noreferrer" target="_blank" >
          Ticket Link</a>  /  <a href={props.event.fbLink} target="_blank" rel="noopener noreferrer">Facebook Event
            </a>
          </span>
        )
      }
      else{
        links = (<span className="small"><a href={props.event.ticketLink} target="_blank" rel="noopener noreferrer">Ticket Link</a><br /></span>)
      }
    }
    else if (props.event.fbLink){
      links = (<span className="small"><a href={props.event.fbLink} target="_blank" rel="noopener noreferrer">Facebook Event</a><br /></span>)
    }
    
    let addRsvpButton = (
      <div className="center nowrap">
        <button className="rsvpbutton center"
          onClick={()=>props.addRsvp(props.loggedInUser._id,props.event._id)}>
          <FontAwesomeIcon className="nowrap" icon={faCheckCircle} /> Add to "My List"
        </button>
      </div>
    )
    let removeRsvpButton = (
      <div className="center">
        <button className="rsvpbutton center"
          onClick={()=>props.removeRsvp(props.loggedInUser._id,props.event._id)}>
           <FontAwesomeIcon className="iconColorAdded" icon={faCheckCircle} /> Added
        </button>
      </div>
    )

    let copyUrlDiv = (
      <div className="center">
        <CopyToClipboard className="center" text={window.location.href}>
              <div className="center nowrap">
                  <button onClick={() => props.copyUrlFxn()}><FontAwesomeIcon icon={faCopy} /> Copy URL
                  </button>
              </div>
            </CopyToClipboard> 
      </div>
    )

    let urlCopiedDiv = (
      <div className="center">
        <CopyToClipboard className="center" text={window.location.href}>
              <div className="center nowrap">
                  <button onClick={() => props.copyUrlFxn()}><FontAwesomeIcon  className="iconColorAdded" icon={faCheck} /> URL Copied!
                  </button>
              </div>
            </CopyToClipboard> 
      </div>
    )

    if(props.event.title){
      detail = (
        <div className="eventDetailMain"> 
            {title}
            {showTime}
            {props.event.fee ? fee : ""}
            {links}
            <br />
            <br />
            {props.loggedInUser ? (props.event.isRsvpd ? removeRsvpButton : addRsvpButton) : "" }
            {props.urlCopied ? urlCopiedDiv : copyUrlDiv }
        </div>
      )
    }
    return (
      <div>{detail}</div>
    );
}

export default eventDetail;
