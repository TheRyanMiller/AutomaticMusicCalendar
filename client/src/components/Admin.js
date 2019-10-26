import React, { Component } from 'react';
import axios from 'axios';
import './Admin.css';
import moment from 'moment';

class Admin extends Component {
  constructor(props){
    super(props);
    this.state = {
      isSignedIn: false,
      loggedInUser: null,
      showModal: false,
      hideSpinner: false,
      activeLoadingOverlay: false,
      lastRefresh: ""
    }
  }
  
  componentDidMount = () =>{
    let instance = axios.create({
      //baseURL: "http://localhost:3001/api",
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
        formattedDate = formattedDate+ " " +moment(lastScrapeDate).format('DD');
        formattedDate = formattedDate+ " " + moment(lastScrapeDate).format('MMM');
        formattedDate = formattedDate+ " " +moment(lastScrapeDate).format('YYYY');
        this.setState({
          lastRefresh: formattedDate
        })
      }
      
    })
  }

  getLastRefreshData = () => {
    let instance = axios.create({
      //baseURL: "http://localhost:3001/api",
      baseURL: process.env.REACT_APP_PROD_API || process.env.REACT_APP_API,
      timeout: 10000,
      headers: {'X-Custom-Header': 'foobar'}
    });

    instance.post('/refreshEvents',{
      
    })
    .then((res) => {
      let scrapeData;
      scrapeData=res.data.data;
      this.setState({
        lastRefresh: scrapeData.scrapeDate
      })
    })
  }

  refreshEventData = () => {
    let scrapeData = {};
    let instance = axios.create({
      //baseURL: "http://localhost:3001/api",
      baseURL: process.env.REACT_APP_PROD_API || process.env.REACT_APP_API,
      timeout: 10000,
      headers: {'X-Custom-Header': 'foobar'}
    });

    instance.post('/refreshEvents',{
      
    })
    .then((res) => {
      scrapeData=res.data.data;
      this.setState({
        lastRefresh: scrapeData.scrapeDate
      })
    })
  }

  render(){
    return (
        <div className="fontColor">
            <br />
            <br />
            <br />
            <p>Last Updated: {this.state.lastRefresh}</p>
            <button onClick={()=>{this.refreshEventData()}}>refresh</button>
        </div>
    )
  }
}
    
export default Admin;