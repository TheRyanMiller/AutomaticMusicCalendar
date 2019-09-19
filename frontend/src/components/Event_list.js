import React from 'react';
import EventTile from './Event_tile';

const eventList = (props) =>{
  let eventList = props.events.map(
    (event,index) => {
      return (
        <EventTile
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
