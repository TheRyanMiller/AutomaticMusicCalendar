import React from 'react';
import './Event_tile.css';
import Aux from '../hoc/Auxx';

const eventTile = (props) =>{
  let tile = (<div className="content-row"></div>);
  if(props.event.title){
    let deck = "";
    if(props.event.stage && props.event.stage === "Deck Stage"){
      deck=(
        <span className="small">
           (DECK STAGE)
        </span>
      );
    }
    tile = (
        <div className={"content-row " + (props.event.isRsvpd ? "rsvpd" : "")} onClick={props.click}>
          <div className="col1">
          <span className="large">{props.event.dateDOW}</span><br />
            <span className="small">{props.event.dateMMM+", "+props.event.dateDD}</span><span className="small"> {props.event.dateYYYY}</span><br />
            
          </div>
          <div className="col2">
              <b>{props.event.title ? props.event.title : ""}</b><br />
              {props.event.location ? props.event.location+" " : ""}
              {deck=="" ? "" : deck}
          </div>
      </div>
    )
  }
  return (
    <Aux> {tile} </Aux>
  )
}

export default eventTile;
