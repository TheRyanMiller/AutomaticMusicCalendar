import React from 'react';
import './Event_tile.css';

const coinImgHolder = (props) =>{
  return (
    <div className="tile">
    <img src={props.event.imgUrl} alt={props.event.title} height="50" width="50"/>
    <div className="textcontainer">
    <p>{props.event.title}</p>
    <p>{props.event.location}</p>
    </div>
    </div>
  )
}

export default coinImgHolder;
