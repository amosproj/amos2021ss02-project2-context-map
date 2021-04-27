import React from 'react';
import logo from './logo.svg';
import './App.css';
import {RandomNumberGeneratorImpl} from "./services/RandomNumberGeneratorImpl";

function App() {
  const rnd = new RandomNumberGeneratorImpl();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello World {rnd.next(2, 3).toPrecision(3)}
        </p>
      </header>
    </div>
  );
}

export default App;
