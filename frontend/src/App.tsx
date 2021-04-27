import React, { useContext } from "react";
import logo from './logo.svg';
import './App.css';
import { RandomNumberGenerator } from "./services/RandomNumberGenerator";
import { DependencyInjectionContext } from './dependency-injection/DependencyInjectionContext';

function App() {
  const rnd = useContext(DependencyInjectionContext).get<RandomNumberGenerator>(RandomNumberGenerator);

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
