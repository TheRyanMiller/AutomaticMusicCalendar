import React, { Component } from 'react';
import axios from 'axios';
import './Admin.css';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

class Admin extends Component {
  constructor(props){
    super(props);
    this.state = {
      isSignedIn: false,
      loggedInUser: null,
      showModal: false,
      hideSpinner: true,
      activeLoadingOverlay: false,
      lastRefresh: "",
      numNewEvents: null
    }
  }
  
  componentDidMount = () =>{
    this.getLastRefreshData();
  }

  getLastRefreshData = () => {
    let instance = axios.create({
      baseURL: process.env.REACT_APP_PROD_API || process.env.REACT_APP_API,
      timeout: 10000,
      headers: {'X-Custom-Header': 'foobar'}
    });

    instance.get('/getScrapeData',{
      
    })
    .then((res) => {
      if(res.data.data && res.data.data.length>0){
        let latestScrape=res.data.data[0];
        let lastScrapeDate = latestScrape.scrapeDate;
        let formattedDate = "";
        formattedDate = moment(lastScrapeDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
        this.setState({
          lastRefresh: formattedDate
        })
      }
      
    })
  }

  refreshEventData = () => {
    let scrapeData = {};
    let instance = axios.create({
      baseURL: process.env.REACT_APP_PROD_API || process.env.REACT_APP_API,
      timeout: 10000,
      headers: {'X-Custom-Header': 'foobar'}
    });

    instance.post('/refreshEvents',{
      
    })
    .then((res) => {
      scrapeData=res.data.data;
      this.setState({
        lastRefresh: moment(scrapeData.scrapeDate).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        numNewEvents: scrapeData.newEvents,
        hideSpinner: true
      })
    })
  }

  render(){
    return (
        <div className="fontColor small">
            <br />
            <br />
            <br />
            <p><b>Last Updated:  </b>
              {this.state.lastRefresh}</p>
            <p style={{display: this.state.numNewEvents || this.state.numNewEvents===0 ? "" : "none"}}><b>
              New Events Added:  </b>{this.state.numNewEvents}</p>
            <button onClick={()=>{
              this.refreshEventData()
              this.setState({hideSpinner: false})
            }}>
              <FontAwesomeIcon 
              className="nowrap fas fa-spinner fa-spin" icon={faSpinner} 
              style={{display: this.state.hideSpinner ? "none" : ""}}
              /> Refresh</button>
        </div>
    )
  }
}
    
export default Admin;