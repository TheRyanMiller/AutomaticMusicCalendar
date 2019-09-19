import React, { Component } from 'react';
import './App.css';
import Navbar from '../components/Navigation/navbar';
import HomePageContainer from './homePageContainer';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      
      listedEvents: [
        { id: '1', title: "Arist one", eventDate: "", location: "Tin Roof", infoLink:"google.com", eventTime:"", imgUrl: "" },
        { id: '2', title: 'Artist 3', eventDate: "", location: "Royal American", infoLink:"google.com", eventTime:"", imgUrl: "" },
        { id: '3', title: 'Show 1', eventDate: "", location: "Pour House", infoLink:"google.com", eventTime:"", imgUrl: "" },
        { id: '4', title: 'Show 1', eventDate: "", location: "Tin Roof", infoLink:"google.com", eventTime:"", imgUrl: "" },
      ],
      otherState: 'Some other value'
    }
  }

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 100000);
      this.setState({ intervalIsSet: interval });
    }
  }

  getDataFromDb = () => {
    fetch('http://192.168.1.188:3001/api/getEvents')
    //fetch('http://localhost:3001/api/getEvents')
      .then((data) => data.json())
      .then((res) => {
          this.setState({ listedEvents: res.data });
      });
  };

  addressAdd = (input,eventId) =>{
    let addressVal = input.value;
    input.value="";
    if (addressVal !== "") {
      let eventIdx = this.state.listedEvents.findIndex(c=>{
        return c.id === eventId;
      });
      let i =0;
      this.state.listedEvents[eventIdx].addresses.map(a=>{
        a.key=""+i++;
      })
      let newIdx = this.state.listedEvents[eventIdx].addresses.length+"";
      let newEvents = [...this.state.listedEvents];
      newEvents[eventIdx].addresses.push({key: newIdx,address: addressVal});
      this.setState({listedEvents : newEvents});
    }
  }

  addressDelete = (deletedAddress,eventId) =>{
    let addressIdx = 0;
    let eventIdx = this.state.listedEvents.findIndex(c=>{
      return c.id === eventId;
    });
    let newEvents = [...this.state.listedEvents];
    addressIdx = newEvents[eventIdx].addresses.findIndex(a=>{
      return a.address===deletedAddress;
    });
    newEvents[eventIdx].addresses.splice(addressIdx,1);
    this.setState({listedEvents : newEvents})
  }

  render() {
    return (
      <div>
        <Navbar buttonText="HOME"/>
        <HomePageContainer
          events={this.state.listedEvents}
          addressAdd={this.addressAdd}
          addressDelete={this.addressDelete}
          />
      </div>
    );
  }
}

export default App;
