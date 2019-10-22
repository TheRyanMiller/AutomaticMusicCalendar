import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink, Link } from "react-router-dom";
import './App.css';
import './nav.css';
import firebase from 'firebase';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import About from '../components/About';
import EventDisplay from '../components/EventDisplay';
import axios from 'axios';
import Modal from 'react-responsive-modal';
import LoadingOverlay from 'react-loading-overlay';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: "https://charleston-live-music-calendar.firebaseio.com",
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: "",
  messagingSenderId: "269138770604",
  appId: "1:269138770604:web:7922b780f534171f963d09",
  measurementId: "G-MSQCVTQQ7H"
})


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isSignedIn: false,
      loggedInUser: null,
      showModal: false,
      hideSpinner: false,
      activeLoadingOverlay: false
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      if(!!user) this.signinCallback();
    })
  }

  loadingSpinner = () =>{
    this.setState({
      activeLoadingOverlay: !this.state.activeLoadingOverlay
    })
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
      this.setState({
        loggedInUser: user,
        isSignedIn: true,
        showModal: false
      })

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

  handleModalClose = () =>{
    this.setState({
        showModal:false
    });
  }

  MyListEventDisplay = () => {
    return (
      <EventDisplay 
        loggedInUser={this.state.loggedInUser}
        isSignedIn={this.state.isSignedIn}
        loadingSpinner={this.loadingSpinner}
        isMyList={true}
      />
    );
  }
  EventDisplay = () => {
    return (
      <EventDisplay 
        loggedInUser={this.state.loggedInUser}
        isSignedIn={this.state.isSignedIn}
        loadingSpinner={this.loadingSpinner}
        isMyList={false}
      />
    );
  }


  render() {
    let uiConfig = {
      signInFlow: "popup",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID //,firebase.auth.FacebookAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        //signInSuccess: this.signinCallback()
      }
    }
    let firebaseAuth = (
      <div className="textcontainer fontColor">
        Sign in to save your personalized event list and history.
        <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
            />
      </div>
    )
    let logOffButton = (<span><br /><br /><button onClick={()=>{
        firebase.auth().signOut();
        this.setState({loggedInUser:null, isSignedIn: false});
      }}>
        Log Out</button></span>) 

    return (
      <Router >
        <LoadingOverlay
          active={this.state.activeLoadingOverlay}
          spinner={true}
          text="Loading..."
        >
          <div>
            <Modal
              open={this.state.showModal}
              onClose={this.handleModalClose}
              classNames={{
                overlay: "customOverlay",
                modal: "customModal"
              }}
            ><div className="center">
              {this.state.isSignedIn ? 
                logOffButton
                : 
                firebaseAuth
              }
              </div>
            </Modal>
            <div className="title fontColor">
              <span className="title1">Charleston</span><br />
              <span className="title2">Music Calendar</span>
            </div>
            <nav className="Nav">
              <ul className="fontColor">
                <li><NavLink exact activeStyle={{
                      fontWeight: "bold",
                      borderBottomColor: "#0e2d57",
                      borderBottomWidth: 2,
                      color: "rgb(238, 238, 238)"
                    }} to="/">Home</NavLink></li>
                <li style={{display: this.state.isSignedIn ? "" : "none"}}><NavLink exact activeStyle={{
                      fontWeight: "bold",
                      borderBottomColor: "#0e2d57",
                      borderBottomWidth: 2,
                      color: "rgb(238, 238, 238)"
                      }} 
                      to="/mylist">My List</NavLink></li>
                <li><NavLink activeStyle={{
                      fontWeight: "bold",
                      borderBottomColor: "#0e2d57",
                      borderBottomWidth: 2,
                      color: "rgb(238, 238, 238)"
                    }} to="/about">About</NavLink></li>
                <li><Link to="/" onClick={() => this.setState({showModal: true})} >{this.state.isSignedIn ? "Log Out" : "Login"}</Link></li>
              </ul>
            </nav>
            <Route path="/" exact 
              render={
                this.EventDisplay
              }
              />
            <Route path="/mylist" exact 
              render={
                this.MyListEventDisplay
              }
              /> 
            <Route path="/about" exact component={About} />
            </div>
        </LoadingOverlay>
      </Router>
    );
  }
}

export default App;
