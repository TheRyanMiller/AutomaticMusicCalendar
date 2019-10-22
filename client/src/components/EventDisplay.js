import React, { Component } from 'react';
import EventList from './Event_list';
import EventDetail from './Event_detail';
import Modal from 'react-responsive-modal';
import axios from 'axios';
import moment from 'moment';
import ResultMessage from './ResultMessage';
import './Event_tile2.css';
import './EventDisplay.css';


class EventDisplay extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedInUser: this.props.loggedInUser,
      isSignedIn: this.props.isSignedIn,
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
      activeLoadingOverlay: false,
      hideResultMessage: true,
      selectedLocations: ["the pour house","the royal american","the music farm - charleston","tin roof - charleston"]
    }
  }

  

  componentDidMount = () => {
    this.setState(
      {hideResultMessage: true}
    )
    let eventFilter = "";
    if(this.props.isMyList && this.props.loggedInUser && this.props.loggedInUser._id){
      eventFilter = "My List";
      console.log(this.props.loggedInUser.rsvpdEventIds)
    }
    this.getDataFromDb(eventFilter);
    /*
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb(eventFilter), 1000000);
      this.setState({ intervalIsSet: interval });
    }
    */
  }

  getDataFromDb = (eventFilter) => {
    let url = process.env.REACT_APP_PROD_API || process.env.REACT_APP_API;
    url = url+"/getEvents";
    if(eventFilter === "My List"){
      console.log("USER ID: ",this.props.loggedInUser._id)
      url = url+"?uid="+this.props.loggedInUser._id;
    }
    console.log(url)
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
        }
        this.setState({ 
          events: events,
          displayedEvents: events,
          hideSpinner: true,
          hideResultMessage: true
        });
      })
      .catch(error => {
        console.log("failed to parse JSON: ", error);
        this.setState({
          hideSpinner: true,
          hideResultMessage: false
        })
      });
          
    })
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
    this.props.loadingSpinner()
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
      let user = this.props.loggedInUser;
      user.rsvpdEventIds.push(eventId);
      this.setState({
        loggedInUser : user
      });
      this.props.loadingSpinner()
        
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  removeRsvp = (userId,eventId) => {
    this.props.loadingSpinner()
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
      let user = this.props.loggedInUser;
      let idx = user.rsvpdEventIds.indexOf(eventId);
      user.rsvpdEventIds.splice(idx);
      this.setState({
        loggedInUser : user
      });
      this.props.loadingSpinner()
        
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
  }

  render() {
    let hasLooped=false;
    if(this.props.loggedInUser && this.props.loggedInUser.rsvpdEventIds.length>0){
      let evs = this.state.displayedEvents;
      let rsvps = this.props.loggedInUser.rsvpdEventIds;
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
        <div className="center">
          <div className="filterSection fontColor">
          <span className="center">Search:<br />
          <input 
            type="text" 
            onKeyUp={this.searchHandler}
          /></span>
          <ul className="filterOptions">
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
        <ResultMessage 
            hide={this.state.hideResultMessage}
            className={this.state.hideResultMessage ? "hidden" : "hidden"}
          />
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
        
        <div className="center content-table">
         
          <EventList
            className="center"
            events={this.state.displayedEvents}
            click={this.selectEventHandler}
            loggedInUser = {this.props.loggedInUser}
          />
        </div>
        <Modal
          open={this.state.showModal}
          onClose={this.handleModalClose}
          classNames={{
            overlay: "customOverlay",
            modal: "customModal"
          }}
        >
            <EventDetail
                event={this.state.selectedEvent}
                addRsvp={this.addRsvp}
                removeRsvp={this.removeRsvp}
                loggedInUser={this.props.loggedInUser}
            />
        </Modal>
      </div>
    );
  }
}

export default EventDisplay;