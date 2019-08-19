import React from 'react';
//import Bootstrap from 'react-bootstrap';

const navbar = (props) =>{
  return(
    <nav className="navbar navbar-inverse">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="https://google.com">Logo</a>
        </div>
        <div className="collapse navbar-collapse" id="myNavbar">
          <ul className="nav navbar-nav">
        {/* use className=active to make list item active  */}
            <li><a href="https://google.com">My Portfolio  </a></li>
            <li><a href="https://google.com">Coin List  </a></li>
            <li><a href="https://google.com">Settings  </a></li>
            <li><a href="https://google.com">Contact  </a></li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li><a href="https://google.com"><span className="glyphicon glyphicon-user"></span> Your Account</a></li>
          </ul>
        </div>
      </div>
    </nav>

  )
}

export default navbar;
/*
<nav className="navbar navbar-inverse">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">Logo</a>
    </div>
    <div class="collapse navbar-collapse" id="myNavbar">
      <ul class="nav navbar-nav">
        <li class="active"><a href="#">Home</a></li>
        <li><a href="#">Products</a></li>
        <li><a href="#">Deals</a></li>
        <li><a href="#">Stores</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li><a href="#"><span class="glyphicon glyphicon-user"></span> Your Account</a></li>
      </ul>
    </div>
  </div>
</nav>
*/
