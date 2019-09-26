import React from 'react';

const cockpit = (props) =>{
  const style={
    backgroundColor: "green",
    font: 'inherit',
    border: '1px solid blue',
    padding: '8px',
    cursor: 'pointer',
    color:'white',
  }
  return(
    <div className="App">
      <h1>Hi Im a React App</h1>
      <p>This is actually working</p>
      <button
        style={style}
        onClick={props.clicked}>
        Switch Name.
      </button>

    </div>
  )
}

export default cockpit;
