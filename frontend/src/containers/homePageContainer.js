import React, { Component } from 'react';
import EventList from '../components/Event_list';
import EventDetail from '../components/Event_detail';
import Modal from 'react-responsive-modal';

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
    console.log(ev);
    let eventIdx = this.props.events.findIndex(e=>{
      return e.id === ev.id;
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
        <h1>Upcoming Charleston Music Events</h1>
        <Modal
          open={this.state.showModal}
          onClose={this.handleModalClose}
        >
            <EventDetail
                event={this.state.selectedEvent}
                addressAdd={this.props.addressAdd}
                addressDelete={this.props.addressDelete}
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