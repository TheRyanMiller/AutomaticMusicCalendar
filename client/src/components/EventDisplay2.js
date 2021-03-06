import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import EventList from './Event_list';
import EventDetail from './Event_detail';
import Modal from 'react-responsive-modal';
import axios from 'axios';
import moment from 'moment';
import './Event_tile.css';


class EventDisplay extends Component {
  constructor(props){
    super(props);
    console.log("props!!: ",props);
    this.state = {
      loggedInUser: props.loggedInUser,
      isSignedIn: props.isSignedIn,
      events: [],
      displayedEvents: [],      
      showEventDetails: false,
      selectedEvent: null,
      showModal: false,
      visAddRsvp: true,
      visRemoveRsvp: true,
      searchString: "",
      showEvents: true,
      hideSpinner: false,
      urlCopied: false,
      selectedLocations: ["the pour house","the royal american","the music farm - charleston","tin roof - charleston"]
    }
  }

  

  componentDidMount = () => {
    let url = process.env.REACT_APP_PROD_API || process.env.REACT_APP_API;
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000000);
      this.setState({ intervalIsSet: interval });
    }
    
  }

  copyUrlFxn = () => {
    alert("copied")
    this.setState(
      {urlCopied: true}
    )
    setTimeout(function(){
      this.setState({urlCopied: false});
    }.bind(this),5000);
    console.log(this.state.urlCopeid)
  }
  
  getDataFromDb = () => {
    let url = process.env.REACT_APP_PROD_API || process.env.REACT_APP_API;
    url = url+"/getEvents";
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
          events[i].dateDOW = moment(events[i].eventDate).format('dddd').substr(0,3);
          //console.log(moment().weekday(events[i].dateDOW))
          //console.log(moment(events[i].eventDate).format('dddd'))
        }
        this.setState({ 
          events: events,
          displayedEvents: events,
          hideSpinner: true
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
      baseURL: process.env.REACT_APP_PROD_API || process.env.REACT_APP_API,
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
    if (ev.key === "Enter") {
      ev.preventDefault();
      ev.target.blur();
      console.log("Enter Pressed")
    }
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

  render() {
    //console.log(dotenv.env.API_KEY);
    let hasLooped=false;
    console.log("USER",this.state.loggedInUser)
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
    
    
    return (
      <div>
        
        <Modal
          open={this.state.showModal}
          onClose={this.handleModalClose}
        >
            <EventDetail
                event={this.state.selectedEvent}
                addRsvp={this.addRsvp}
                removeRsvp={this.removeRsvp}
                loggedInUser={this.state.loggedInUser}
                copyUrlFxn={this.copyUrlFxn}
                urlCopied={this.state.urlCopied}
            />
        </Modal>
        <div className="center">
          <div className="filterSection">
          <span className="center">Filters:<br />
          <input 
            type="text" 
            onKeyPress={this.searchHandler}
          /></span>
          <ul >
            <li>
                <label>
                <input type="checkbox" className="myCheckbox" 
                checked={this.state.selectedLocations.includes("The Music Farm - Charleston".toLowerCase())}
                onChange={this.checkBoxHandler}
                value="The Music Farm - Charleston" /> 
                The Music Farm</label>
            </li> <br />
            <li>
              <label>
              <input type="checkbox" className="myCheckbox" 
                checked={this.state.selectedLocations.includes("The Pour House".toLowerCase())}
                onChange={this.checkBoxHandler}
                value="The Pour House" /> 
                The Pour House</label>
            </li><br />
            <li>
              <label>
              <input type="checkbox" className="myCheckbox" 
                checked={this.state.selectedLocations.includes("The Royal American".toLowerCase())}
                onChange={this.checkBoxHandler}
                value="The Royal American" /> 
                Royal American</label>
            </li> <br />
            <li>
              <label>
              <input type="checkbox" className="myCheckbox" 
                checked={this.state.selectedLocations.includes("tin roof - charleston".toLowerCase())}
                onChange={this.checkBoxHandler}
                value="Tin Roof - Charleston" /> 
                Tin Roof</label>
            </li>
          </ul>
        </div>
        </div>
        <div className="center">
          <div hidden={this.state.hideSpinner} className="sk-circle">
            <div className="sk-circle1 sk-child"></div>
            <div className="sk-circle2 sk-child"></div>
            <div className="sk-circle3 sk-child"></div>
            <div className="sk-circle4 sk-child"></div>
            <div className="sk-circle5 sk-child"></div>
            <div className="sk-circle6 sk-child"></div>
            <div className="sk-circle7 sk-child"></div>
            <div className="sk-circle8 sk-child"></div>
            <div className="sk-circle9 sk-child"></div>
            <div className="sk-circle10 sk-child"></div>
            <div className="sk-circle11 sk-child"></div>
            <div className="sk-circle12 sk-child"></div>
          </div>
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

export default EventDisplay;