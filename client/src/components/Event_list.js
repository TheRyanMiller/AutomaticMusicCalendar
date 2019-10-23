import React from 'react';
import EventTile from './Event_tile2';
import mfimg from '../assets/midimages/mf.png';
import phimg from '../assets/midimages/ph.png';
import trimg from '../assets/midimages/tr.png';
import raimg from '../assets/midimages/ra3.png';

const eventList = (props) =>{
  let img;
  let width;
  let height;
  
  let eventList = props.events.map(
    (event,index) => {
      if(event.locAcronym === "ra") {
        img=raimg;
        width="45";
        height="28";
      }
      if(event.locAcronym === "ph") {
        img=phimg;
        width="40";
        height="40";
      }
      if(event.locAcronym === "tr") {
        img=trimg;
        width="40";
        height="28";
      }
      if(event.locAcronym === "mf"){
        img=mfimg;
        width="40";
        height="28";
      }
      return (
        <EventTile
          className="center"
          event={event}
          change={(e) => props.changed(e,event._id)}
          click={() => {
              props.click(event);
            }
          }
          img={img}
          imgHeight={height}
          imgWidth={width}
          key={event._id}
          />
      )
    }
  )

  return eventList;

}

export default eventList;
