import React from 'react';
import { withRouter  } from "react-router-dom";


const about = (props) =>{
  
  let about = (
      <div>Charleston Music Calendar (CMC) is a website designed to make it simple to see 
        all of Charleston's upcoming live music events in one place.
          <br /><br />
          
          This site works by scraping data from the websites of a few of my favorite 
          local venues, and then aggregating it all together into a viewable and 
          searchable form. If you find any bugs, please report them to my <a href="https://github.com/TheRyanMiller/CharlestonLiveMusicCalendar/issues">GitHub project</a>.
          <br /><br />
          I hope to contiue slowly adding features to this site.

      </div>
  )

  return about;

}

export default withRouter(about);
