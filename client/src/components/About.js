import React from 'react';
import { withRouter  } from "react-router-dom";
import '../containers/App.css';
import logo from '../assets/sizedlogos/cmc-white.png';


const about = (props) =>{
  var divStyle = {
    padding: "30px",
    width:"80%"
  };
  let about = (
      <div className="fontColor about" style={divStyle}>Charleston Music Calendar is a project I created to aggregate local 
      music events onto a single web page.
          <br /><br />
          This site automatically scrapes concert data directly from the websites of a few of my favorite 
          local venues. All of the events are then organized and presented here in an always-up-to-date, 
          searchable form. 
          <br /><br />
          <a href="https://github.com/TheRyanMiller/CharlestonLiveMusicCalendar">GitHub project</a><br />
          <a href="https://github.com/TheRyanMiller/CharlestonLiveMusicCalendar/issues">Report an Issue</a>
          

      </div>
  )

  return about;

}

export default withRouter(about);
