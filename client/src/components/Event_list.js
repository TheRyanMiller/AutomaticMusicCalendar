import React from 'react';
import EventTile from './Event_tile_withUpVote';
import mfimg from '../assets/midimages/mf.png';
import phimg from '../assets/midimages/ph.png';
import trimg from '../assets/midimages/tr.png';
import raimg from '../assets/midimages/ra3.png';

const eventList = (props) =>{
  let img;
  let width;
  let height;
  let la = "";
  
  let eventList = props.events.map(
    (event,index) => {
      if(event.locAcronym) la = event.locAcronym.toLowerCase();
      if(la === "ra") {
        img=raimg;
        width="45";
        height="28";
      }
      if(la === "ph") {
        img=phimg;
        width="40";
        height="40";
      }
      if(la === "tr") {
        img=trimg;
        width="40";
        height="28";
      }
      if(la === "mf"){
        img=mfimg;
        width="40";
        height="28";
      }
      return (
        <EventTile
          className="center"
          event={event}
          upvote={props.upvote}
          change={(e) => props.changed(e,event._id)}
          idx={index}
          click={() => {
              props.click(event);
            }
          }
          img={img}
          imgHeight={height}
          imgWidth={width}
          key={event._id}
          user={props.user}
          />
      )
    }
  )

  return eventList;

}

export default eventList;
