import React from 'react';
import EventTile from './Event_tile';

const eventTileList = (props) =>{
  let eventList = props.events.map(
    (event,index) => {
      return (
        <EventTile
          event={event}
          change={(e) => props.changed(e,event.id)}
          click={() => {
              props.click(event);
            }
          }
          key={event.id}
          />
      )
    }
  )

  return eventList;

}

export default eventTileList;
