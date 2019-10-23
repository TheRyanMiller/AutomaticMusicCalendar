import React from 'react';
import './Event_tile2.css';
import Aux from '../hoc/Auxx';
import mfimg from '../assets/midimages/mf.png';
import phimg from '../assets/midimages/ph.png';
import trimg from '../assets/midimages/tr.png';
import raimg from '../assets/midimages/ra3.png';

const eventTile = (props) =>{
  let tile = (<div className="content-row"></div>);
  let img, height, width;
  if(props.event.locAcronym === "ra") {
    img=raimg;
    width="45";
    height="28";
  }
  if(props.event.locAcronym === "ph") {
    img=phimg;
    width="40";
    height="40";
  }
  if(props.event.locAcronym === "tr") {
    img=trimg;
    width="40";
    height="28";
  }
  if(props.event.locAcronym === "mf"){
    img=mfimg;
    width="40";
    height="28";
  }
  let location = props.event.location ? props.event.location : "";
  if(location==="The Music Farm - Charleston") location = "Music Farm";
  if(location==="The Pour House") location = "Pour House";
  if(location==="Tin Roof - Charleston") location = "Tin Roof";
  if(location==="The Royal American") location = "Royal American";

  if(props.event.title){
    let deck = "";
    if(props.event.stage && props.event.stage === "Deck Stage"){
      deck=(
        <span className="deck">
            (DECK)
        </span>
      );
    }
    tile = (
        <div className={"fontColor row " + (props.event.isRsvpd ? "rsvpd" : "")} onClick={props.click}>
          
          <div className="col1">
            <span className="large">{props.event.dateDOW}</span><br />
            <span className="small">{props.event.dateMMM+". "+props.event.dateDD}</span><span className="small"></span><br />
          </div>
          
          <div className="col2">
              <span className="titleline"><b>{props.event.title ? props.event.title : ""}</b></span><br />
              <span className="locationline">{location}  </span>
              {deck==="" ? "" : deck}
          </div>
          <div className={"col3 center"}>
            <img width={width} height={height} src={img} alt="Venue logo"></img>
          </div>
          
          
      </div>
    )
  }
  return (
    <Aux className="container"> {tile} </Aux>
  )
}

export default eventTile;
