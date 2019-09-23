import React, { Component } from 'react';
import EventList from '../components/Event_list';
import EventDetail from '../components/Event_detail';
import Modal from 'react-responsive-modal';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import '../components/Event_tile.css';

class HomePageContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      events: [
        { id: '1', title: "Arist one", eventDate: "", location: "Tin Roof", infoLink:"google.com", eventTime:"", imgUrl: "" },
        { id: '2', title: 'Artist 3', eventDate: "", location: "Royal American", infoLink:"google.com", eventTime:"", imgUrl: "" },
        { id: '3', title: 'Show 1', eventDate: "", location: "Pour House", infoLink:"google.com", eventTime:"", imgUrl: "" },
        { id: '4', title: 'Show 1', eventDate: "", location: "Tin Roof", infoLink:"google.com", eventTime:"", imgUrl: "" },
      ],
      loggedInUser: null,
      showEventDetails: false,
      selectedEvent: null,
      showModal: false,
      visAddRsvp: true,
      visRemoveRsvp: true

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
          this.setState({ events: res.data });
      });
  };

  addressAdd = (input,eventId) =>{
    let addressVal = input.value;
    input.value="";
    if (addressVal !== "") {
      let eventIdx = this.state.events.findIndex(c=>{
        return c.id === eventId;
      });
      let i =0;
      this.state.events[eventIdx].addresses.map(a=>{
        a.key=""+i++;
      })
      let newIdx = this.state.events[eventIdx].addresses.length+"";
      let newEvents = [...this.state.events];
      newEvents[eventIdx].addresses.push({key: newIdx,address: addressVal});
      this.setState({events : newEvents});
    }
  }

  addressDelete = (deletedAddress,eventId) =>{
    let addressIdx = 0;
    let eventIdx = this.state.listedEvents.findIndex(c=>{
      return c.id === eventId;
    });
    let newEvents = [...this.state.events];
    addressIdx = newEvents[eventIdx].addresses.findIndex(a=>{
      return a.address===deletedAddress;
    });
    newEvents[eventIdx].addresses.splice(addressIdx,1);
    this.setState({listedEvents : newEvents})
  }

  selectEventHandler = (ev) => {
    let eventIdx = this.state.events.findIndex(e=>{
      return e.id === ev.id;
    });

    const events = [...this.state.events];
    const event = events[eventIdx];

    events[eventIdx] = event;
    this.setState({
      selectedEvent:ev,
      showEventDetails:false,
      showModal: true
    });
  }

  handleModalClose = () =>{
    this.setState({
        showModal:false
    });
  }

  addRsvp = (userId,eventId) => {
    let instance = axios.create({
      baseURL: "http://192.168.1.188:3001/api",
      timeout: 10000,
      headers: {'X-Custom-Header': 'foobar'}
    });

    instance.post('/addRsvp',{
      userId: userId,
      eventId: eventId
    })
    .then((response) => {
      console.log(response);
      let user = this.state.loggedInUser;
      user.rsvpdEventIds.push(eventId);
      this.setState({
        loggedInUser : user
      });
        
    })
    .catch(function (error) {
      console.log(error);
    });

  }
  removeRsvp = (userId,eventId) => {
    let instance = axios.create({
      baseURL: "http://192.168.1.188:3001/api",
      timeout: 10000,
      headers: {'X-Custom-Header': 'foobar'}
    });

    instance.post('/removeRsvp',{
      userId: userId,
      eventId: eventId
    })
    .then((response) => {
      console.log(response);
      let user = this.state.loggedInUser;
      console.log("IDs",user.rsvpdEventIds);
      
      let idx = user.rsvpdEventIds.indexOf(eventId);
      user.rsvpdEventIds.splice(idx);
      console.log("AFTER IDs",user.rsvpdEventIds);
      this.setState({
        loggedInUser : user
      });
        
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  componentClicked = response => {

  }

  responseFacebook = response => {
    console.log(response)
    let user = {
      isGoogle: false,
      isFacebook: true,
      facebookId: response.id,
      name: response.name,
      pictureUrl: response.picture.data.url,
      accessToken: response.accessToken,
      email: response.email,
      rsvpdEventIds: []
    }


    //Check for user in DB, if doesn't exist, then create
    let instance = axios.create({
      baseURL: "http://192.168.1.188:3001/api",
      timeout: 10000,
      headers: {'X-Custom-Header': 'foobar'}
    });

    instance.post('/checkUser',{
      user: user
    })
    .then( response => {
      console.log("ABOUT TO SET STATE@@@!!!!!___")
      console.log(response.data.data);
      console.log(response.data.data.rsvpdEventIds.length);
      this.setState({
        loggedInUser: response.data.data
      })
      console.log(this.state.loggedInUser);
    });
  }

  render() {
    if(this.state.loggedInUser && this.state.loggedInUser.rsvpdEventIds.length>0){
      let evs = this.state.events;
      let rsvps = this.state.loggedInUser.rsvpdEventIds;
      for(let i=0;i<evs.length;i++){
        evs[i].isRsvpd = false;
        if(rsvps.indexOf(evs[i]._id) > -1){
          evs[i].isRsvpd = true;
        }
      }
    }
    return (
      <div>
        <h1>Upcoming Charleston Music Events</h1>
        <Modal
          open={this.state.showModal}
          onClose={this.handleModalClose}
        >
            <EventDetail
                event={this.state.selectedEvent}
                addRsvp={this.addRsvp}
                removeRsvp={this.removeRsvp}
                loggedInUser={this.state.loggedInUser}
            />
        </Modal>
        { this.state.loggedInUser ? "" :
          <FacebookLogin
            appId="1292181117572934"
            autoLoad={true}
            fields="name,email,picture"
            onClick={this.componentClicked}
            callback={this.responseFacebook} 
          />
        }
        <div className="content-table">
          <EventList
            events={this.state.events}
            click={this.selectEventHandler}
            loggedInUser = {this.state.loggedInUser}
          />
        </div>
      </div>
    );
  }
}

export default HomePageContainer;