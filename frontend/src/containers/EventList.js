import React, { Component } from 'react';
import EventTileList from '../components/Event_tile_list';
import EventDetails from '../components/Event_detail';
import Modal from 'react-responsive-modal';

class EventList extends Component {
  constructor(props){
    super(props);
    this.state = {
      showEventDetails: false,
      selectedEvent: null,
      showModal: false

    }
  }

  addressAddHandler = (adress) => {

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

  selectEventHandler = (id) => {
    let eventIdx = this.props.events.findIndex(c=>{
      return c.id === id;
    });

    const events = [...this.props.events];
    const event = events[eventIdx];
    //const person = [...this.state.person][personIdx];

    events[eventIdx] = event;
    this.setState({
      selectedEvent:event,
      showEventDetails:false,
      showModal: true
    });
  }

  handleModalClose = () =>{
    this.setState({showModal:false});
  }

  render() {
    let portfolioDisplay = null;

    return (
      <div>
        <h1>Event List</h1>
        <Modal
          open={this.state.showModal}
          onClose={this.handleModalClose}
        >
          <EventDetails
            event={this.state.selectedEvent}
            addressAdd={this.props.addressAdd}
            addressDelete={this.props.addressDelete}
          />
        </Modal>
        <EventTileList
          events={this.props.events}
          click={this.selectEventHandler}
        />
      </div>
    );
  }
}

export default EventList;
