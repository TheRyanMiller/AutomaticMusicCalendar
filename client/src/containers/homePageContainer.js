import React, { Component } from 'react';
import EventList from '../components/Event_list';
import EventDetail from '../components/Event_detail';
import Modal from 'react-responsive-modal';
import axios from 'axios';
import moment from 'moment';
import '../components/Event_tile.css';
import './bootstrap-social.css';
import firebase from 'firebase';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";


firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
})

class HomePageContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      events: [],
      displayedEvents: [],
      isSignedIn: false,
      loggedInUser: null,
      showEventDetails: false,
      selectedEvent: null,
      showModal: false,
      visAddRsvp: true,
      visRemoveRsvp: true,
      searchString: "",
      selectedLocations: ["the pour house","the royal american","the music farm - charleston","tin roof - charleston"]
    }
  }

  

  componentDidMount = () => {
    let url = process.env.REACT_APP_PROD_API || process.env.REACT_APP_API;
    console.log("API URL using: ",url+"/getEvents");
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 100000);
      this.setState({ intervalIsSet: interval });
    }
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      if(!!user) this.signinCallback();
    })
  }

  getDataFromDb = () => {
    let url = process.env.REACT_APP_PROD_API || process.env.REACT_APP_API;
    url = url+"/getEvents";
    console.log("API URL using: ",url);
    fetch(url,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }

    })
    .then((res) => {
      let events;
      res.json().then((data)=>{
        events=data.data;
        for(let i=0; i<events.length; i++){
          events[i].dateMMM = moment(events[i].eventDate).format('MMM');
          events[i].dateDD = moment(events[i].eventDate).format('DD');
          events[i].dateYYYY = moment(events[i].eventDate).format('YYYY');
        }
        this.setState({ 
          events: events,
          displayedEvents: events
        });
      })
          
    });
  };

  selectEventHandler = (ev) => {
    let eventIdx = this.state.displayedEvents.findIndex(e=>{
      return e.id === ev.id;
    });

    const events = [...this.state.displayedEvents];
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
      baseURL: process.env.REACT_APP_PROD_API || process.env.REACT_APP_API,
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
      baseURL: process.env.PROD_API || process.env.REACT_APP_API,
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

  

  searchHandler = (ev) => {
    let searchQuery = ev.target.value.toLowerCase();
    this.setState({
      searchString: searchQuery
    },()=>this.filterEventList(searchQuery))
  }

  filterEventList = (searchString) => {
    if(!searchString) searchString = this.state.searchString;
    let displayedEvents = this.state.events.filter((el) => {
    let searchValue = el.title.toLowerCase();
    //Run Checkbox logic
    if(this.state.selectedLocations.includes(el.location.toLowerCase())){
      if(searchString==="" || !searchString) return true;
      return searchValue.indexOf(searchString) !== -1;
    }
    return false;
    })
    this.setState({
      displayedEvents: displayedEvents
    })
  }

  checkBoxHandler = (el) => {
    let newLocations = [...this.state.selectedLocations];
    if(el.target.checked){
      newLocations.push(el.target.value.toLowerCase())
    }
    if(!el.target.checked){
      for(var i = 0; i < newLocations.length; i++){ 
        if (newLocations[i] === el.target.value.toLowerCase()) {
          newLocations.splice(i, 1); 
          i--;
        }
      }
    }
    this.setState({
      selectedLocations: newLocations
    },()=>this.filterEventList())
    
    //el.target.checked=!this.state.selectedLocations.includes("Tin Roof - Charleston".toLowerCase)
    //Set State
  }
  
  componentClicked = response => {
    //Action when clicking FBlogin
  }

  signinCallback = () => {
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
        baseURL: process.env.REACT_APP_PROD_API || process.env.REACT_APP_API,
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
    //console.log(dotenv.env.API_KEY);
    let hasLooped=false;
    if(this.state.loggedInUser && this.state.loggedInUser.rsvpdEventIds.length>0){
      let evs = this.state.displayedEvents;
      let rsvps = this.state.loggedInUser.rsvpdEventIds;
      for(let i=0;i<evs.length;i++){
        evs[i].isRsvpd = false;
        if(rsvps.indexOf(evs[i]._id) > -1){
          evs[i].isRsvpd = true;
        }
      }
      hasLooped=true;
    }
    if(!hasLooped){
      let evs = this.state.displayedEvents;
      for(let i=0;i<evs.length;i++){
        evs[i].isRsvpd = false;
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
        this.setState({loggedInUser:null, isSignedIn: false});
      }}>
        Log Out</button></span>) 
    
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
        <div className="center"> 
        PROD API value: {process.env.REACT_APP_PROD_API} + {process.env.REACT_APP_PROD_API+"/getEvents"}
        <br />
          Search Events:
          <input 
            type="text" 
            onChange={this.searchHandler}
          />
          <ul className="filterSection">
            <li>
              <input type="checkbox" className="myCheckbox" 
                checked={this.state.selectedLocations.includes("The Music Farm - Charleston".toLowerCase())}
                onChange={this.checkBoxHandler}
                value="The Music Farm - Charleston" /> 
                <label>The Music Farm</label>
            </li>
            <li>
              <input type="checkbox" className="myCheckbox" 
                checked={this.state.selectedLocations.includes("The Pour House".toLowerCase())}
                onChange={this.checkBoxHandler}
                value="The Pour House" /> 
                <label>The Pour House</label>
            </li><br />
            <li>
              <input type="checkbox" className="myCheckbox" 
                checked={this.state.selectedLocations.includes("The Royal American".toLowerCase())}
                onChange={this.checkBoxHandler}
                value="The Royal American" /> 
                <label>Royal American</label>
            </li>
            <li>
              <input type="checkbox" className="myCheckbox" 
                checked={this.state.selectedLocations.includes("tin roof - charleston".toLowerCase())}
                onChange={this.checkBoxHandler}
                value="Tin Roof - Charleston" /> 
                <label>Tin Roof</label>
            </li>
          </ul>
        </div>
        <div className="content-table">
          <EventList
            events={this.state.displayedEvents}
            click={this.selectEventHandler}
            loggedInUser = {this.state.loggedInUser}
          />
        </div>
      </div>
    );
  }
}

export default HomePageContainer;