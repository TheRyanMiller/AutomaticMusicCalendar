import React from 'react';
import EventTile from './Event_tile2';

const eventList = (props) =>{
  
  let eventList = props.events.map(
    (event,index) => {
      return (
        <EventTile
          className="center"
          event={event}
          change={(e) => props.changed(e,event._id)}
          click={() => {
              props.click(event);
            }
          }
          key={event._id}
          />
      )
    }
  )

  return eventList;

}

export default eventList;
