import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink, IndexLink, Link } from "react-router-dom";
import './App.css';
import './nav.css';
import firebase from 'firebase';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import About from '../components/About';
import EventDisplay from '../components/EventDisplay';
import axios from 'axios';
import Modal from 'react-responsive-modal';

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
      showModal: false
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      if(!!user) this.signinCallback();
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

  handleModalClose = () =>{
    this.setState({
        showModal:false
    });
  }



  render() {
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
      <Router>
        <Modal
          open={this.state.showModal}
          onClose={this.handleModalClose}
        >
          {this.state.isSignedIn ? 
          logOffButton
          : 
          firebaseAuth
        }
        </Modal>
        <h2 className="title">Charleston Music Calendar</h2>
        <nav className="Nav">
          <ul>
            <li><NavLink exact activeStyle={{
                  fontWeight: "bold",
                  borderBottomColor: "purple",
                  borderBottomWidth: 2,
                  color: "purple"
                }} to="/">Home</NavLink></li>
            <li><NavLink activeStyle={{
                  fontWeight: "bold",
                  borderBottomColor: "purple",
                  borderBottomWidth: 2,
                  color: "purple"
                }} to="/about">About</NavLink></li>
            <li><Link activeClassName="active" onClick={() => this.setState({showModal: true})} >{this.state.isSignedIn ? "Log Out" : "Login"}</Link></li>
          </ul>
        </nav>
        
        <Route path="/" exact component={EventDisplay} />
        <Route path="/about" exact component={About} />
        
        

      </Router>
    );
  }
}

export default App;
