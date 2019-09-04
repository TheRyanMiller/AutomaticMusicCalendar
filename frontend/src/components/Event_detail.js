import React, { Component } from "react";
import EventAdder from './Event_adder';
import EventList from './Event_list';

class EventDetails extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className="CoinDetailsDiv">
        <h1>{this.props.event.name}</h1>
        <EventAdder
          addressAdd={this.props.addressAdd}
          event={this.props.event}
          />
        <EventList
          event={this.props.event}
          addressDelete={this.props.addressDelete}
        />
      </div>
    );
  }
}

export default EventDetails;
