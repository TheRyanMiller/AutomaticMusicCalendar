import React from 'react';
import './Event_tile.css';

const eventTile = (props) =>{
  let tile = (<div></div>);
  if(props.event.title){
    tile = (
      <div onClick={props.click}>
        <div className="tile">
          <img src={props.event.imgUrl} height="50" width="50"/>
          <div className="textcontainer">
          {props.event.title ? props.event.title : ""}<br />
          {props.event.eventDate ? props.event.eventDate.substring(0, props.event.eventDate.indexOf("T")) : ""}<br />
          {props.event.location ? props.event.location : ""}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div> {tile} </div>
  )
}

export default eventTile;
