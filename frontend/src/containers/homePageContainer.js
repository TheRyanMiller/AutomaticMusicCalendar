import React, { Component } from 'react';
import EventList from '../components/Event_list';
import EventDetail from '../components/Event_detail';
import Modal from 'react-responsive-modal';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import moment from 'moment';
import '../components/Event_tile.css';
import './bootstrap-social.css';
import firebase from 'firebase';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

firebase.initializeApp({
  apiKey: "AIzaSyCEIQdLJ2J2ybB3S9QOJmWvT9an6BDFWVw",
  authDomain: "charleston-music-1569242598820.firebaseapp.com"
})

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
      isSignedIn: false,
      loggedInUser: null,
      showEventDetails: false,
      selectedEvent: null,
      showModal: false,
      visAddRsvp: true,
      visRemoveRsvp: true
    }
  }

  

  componentDidMount = () => {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 100000);
      this.setState({ intervalIsSet: interval });
    }
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      if(!!user) this.signinCallback();
      console.log("user", user)
    })
  }

  getDataFromDb = () => {
    fetch('http://192.168.1.188:3001/api/getEvents')
      .then((data) => data.json())
      .then((res) => {
          let events =res.data;
          for(let i=0; i<events.length; i++){
            events[i].dateMMM = moment(events[i].eventDate).format('MMM');
            events[i].dateDD = moment(events[i].eventDate).format('DD');
            events[i].dateYYYY = moment(events[i].eventDate).format('YYYY');
          }
          this.setState({ events });
      });
  };

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
      let user = this.state.loggedInUser;
      let idx = user.rsvpdEventIds.indexOf(eventId);
      user.rsvpdEventIds.splice(idx);
      this.setState({
        loggedInUser : user
      });
        
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  responseGoogle = response => {

  }
  
  componentClicked = response => {
    //Action when clicking FBlogin
  }

  signinCallback = () => {
    console.log("CHECK IF LOADED FIREBASE OBJECT",firebase.auth())
    if(!!firebase.auth().currentUser){
      let user = {
        uid: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.displayName,
        photoUrl: firebase.auth().currentUser.photoURL,
        email: firebase.auth().currentUser.email,
        rsvpdEventIds: []
      }
      this.setState({loggedInUser: user})


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
        this.setState({
          loggedInUser: response.data.data
        })
      });
    }
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
    let uiConfig = {
      signInFlow: "popup",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        //signInSuccess: this.signinCallback()
      }
    }
    let firebaseAuth = (
      <div className="textcontainer">
        <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
            />
      </div>
    )
    let logOffButton = (<span><button onClick={()=>{
        firebase.auth().signOut();
        this.setState({loggedInUser:null});
        console.log(this.state.loggedInUser)
      }

    }>Log Out</button></span>) 
    
    return (
      <div>
        <h2 className="title">Charleston Music Calendar</h2>
        {this.state.isSignedIn ? 
          logOffButton
          : 
          firebaseAuth
        }
        
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