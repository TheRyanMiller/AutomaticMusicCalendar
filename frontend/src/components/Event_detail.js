import React, { Component } from "react";
import EventInfo from './Event_info';


class EventDetails extends Component {
  constructor(props){
    super(props);
    this.state = {
      event: null
    }
  }

  render() {
    return (
      <div className="EventDetailsDiv">
        <h1>{this.props.name}</h1>
        <EventInfo
          addRsvp={this.props.addRsvp}
          removeRsvp={this.props.removeRsvp}
          event={this.props.event}
          loggedInUser={this.props.loggedInUser}
          isRsvpd={this.props.visAddRsvp}
          />
      </div>
    );
  }
}

export default EventDetails;
