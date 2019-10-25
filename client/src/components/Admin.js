import React, { Component } from 'react';
import axios from 'axios';
import './Admin.css'
import Aux from '../hoc/Auxx';

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