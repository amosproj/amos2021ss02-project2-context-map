import React from "react";
import logo from './logo.svg';
import './App.css';
import { RandomNumberGenerator } from "./services/RandomNumberGenerator";
import { useService } from "./dependency-injection/useService";

type AppProps = {
  rnd?: RandomNumberGenerator
};

function App(props: AppProps = {}) {
  const rnd = props.rnd ?? useService<RandomNumberGenerator>(RandomNumberGenerator);

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
