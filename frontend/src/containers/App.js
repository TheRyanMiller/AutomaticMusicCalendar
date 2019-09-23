import React, { Component } from 'react';
import './App.css';
import Navbar from '../components/Navigation/navbar';
import HomePageContainer from './homePageContainer';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      
      
    }
  }

  

  

  render() {
    return (
      <div>
        <HomePageContainer
          />
      </div>
    );
  }
}

export default App;
