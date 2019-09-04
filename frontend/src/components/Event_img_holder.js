import React from 'react';
import './Event_tile.css';

const coinImgHolder = (props) =>{
  return (
    <div className="tile">
    <img src={props.event.imgUrl} height="50" width="50"/>
    <div className="textcontainer">
    {props.event.title}<br />
    {props.event.eventDate.substring(0, props.event.eventDate.indexOf("T"))}<br />
    {props.event.location}
    </div>
    </div>
  )
}

export default coinImgHolder;
