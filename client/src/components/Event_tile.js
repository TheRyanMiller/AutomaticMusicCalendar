import React from 'react';
import './Event_tile.css';
import Aux from '../hoc/Auxx';
import mfimg from '../assets/sizedlogos/mf.png';
import phimg from '../assets/sizedlogos/ph.png';
import trimg from '../assets/sizedlogos/tr.png';
import raimg from '../assets/sizedlogos/ra.png';

const eventTile = (props) =>{
  let tile = (<div className="content-row"></div>);
  let img;
  if(props.event.locAcronym == "ra") img=raimg;
  if(props.event.locAcronym == "ph") img=phimg;
  if(props.event.locAcronym == "tr") img=trimg;
  if(props.event.locAcronym == "mf") img=mfimg;

  let edgeColor = props.event.locAcronym+"Color";
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
            <span className="small">{props.event.dateMMM+", "+props.event.dateDD}</span><span className="small"></span><br />
          </div>
          
          <div className="col2">
              <b>{props.event.title ? props.event.title : ""}</b><br />
              {props.event.location ? props.event.location+" " : ""}
              {deck=="" ? "" : deck}
          </div>
          <div className={" rowEdge"}>
            <img src={img} alt="Venue Logo"></img>
          </div>
          
          
      </div>
    )
  }
  return (
    <Aux> {tile} </Aux>
  )
}

export default eventTile;
