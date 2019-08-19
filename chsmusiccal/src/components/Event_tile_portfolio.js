import React from 'react';
import EventImgHolder from './Event_img_holder';
//import './Event_tile.css';

const eventTile = (props) =>{
  return (
    <div onClick={props.click}>
      <EventImgHolder event={props.event}/>
    </div>
  )
}


export default eventTile;
