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
      <div className="fontColor about" style={divStyle}>Charleston Music Calendar (CMC) is a website I designed to make it simple to see 
        all of Charleston's upcoming live music events in one place.
          <br /><br />
          This site automatically scrapes data directly from the websites of a few of my favorite 
          local venues, and then aggregating it all together into a viewable and 
          searchable form. If you find any bugs, please report them to my <a href="https://github.com/TheRyanMiller/CharlestonLiveMusicCalendar/issues">GitHub project</a>.
          <br /><br />
          I hope to continue adding features over time. Thank you for visiting!

      </div>
  )

  return about;

}

export default withRouter(about);
