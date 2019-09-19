import React, { Component } from 'react';
import EventList from '../components/Event_list';
import EventDetail from '../components/Event_detail';
import Modal from 'react-responsive-modal';
import axios from 'axios';

class HomePageContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      showEventDetails: false,
      selectedEvent: null,
      showModal: false

    }
  }

  componentDidMount(){
    //blockchain.info/q/addressbalance/1EzwoHtiXB4iFwedPr49iywjZn2nnekhoj?confirmations=6
    /*
    Axios.get('https://blockchain.info/q/addressbalance/3Jp7Sb5TN7HZbfQsCchLAhXPvCPjt6wLi3')
      .then(response =>{
        console.log("Balance = "+response.data / 100000000 +" BTC");
      });
      */
  }

  selectEventHandler = (ev) => {
    let eventIdx = this.props.events.findIndex(e=>{
      return e.id === ev.id;
    });

    const events = [...this.props.events];
    const event = events[eventIdx];
    //const person = [...this.state.person][personIdx];

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
    console.log(userId,eventId);
    let instance = axios.create({
      baseURL: "http://192.168.1.188:3001/api",
      timeout: 10000,
      headers: {'X-Custom-Header': 'foobar'}
    });

    instance.post('/addRsvp',{
      userId: userId,
      eventId: eventId
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });;

  }
  removeRsvp = (userId,eventId) => {
    axios.post('http://192.168.1.188:3001/api/deleteRsvp');
  }

  render() {
    let portfolioDisplay = null;

    return (
      <div>
        <h1>Upcoming Charleston Music Events</h1>
        <Modal
          open={this.state.showModal}
          onClose={this.handleModalClose}
        >
            <EventDetail
                event={this.state.selectedEvent}
                addressAdd={this.props.addressAdd}
                addressDelete={this.props.addressDelete}
                addRsvp={this.addRsvp}
                removeRsvp={this.removeRsvp}
            />
        </Modal>
        <EventList
          events={this.props.events}
          click={this.selectEventHandler}
        />
      </div>
    );
  }
}

export default HomePageContainer;