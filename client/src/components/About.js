import React from 'react';
import { withRouter  } from "react-router-dom";
import '../containers/App.css';



const about = (props) =>{
  var divStyle = {
    padding: "30px",
    width:"80%"
  };
  let about = (
    <div className="center">
      <div className="fontColor about" style={divStyle}>Charleston Music Calendar is a project I created to aggregate local 
      music events onto a single web page.
          <br /><br />
          This site automatically scrapes concert data directly from the websites of a few of my favorite 
          local venues. All of the events are then organized and presented here in an always-up-to-date, 
          searchable form. 
          <br /><br />
          <br /><br />
          <a href="https://github.com/TheRyanMiller/CharlestonLiveMusicCalendar">View this project on GitHub</a><br />
          <a href="https://github.com/TheRyanMiller/CharlestonLiveMusicCalendar/issues">Report a bug or an issue</a>
      </div>
    </div>
  )

  return about;

}

export default withRouter(about);
