import React from 'react';
import logo from './logo.svg';
import './App.css';
import RandomNumberGenerator from './services/RandomNumberGenerator';
import useService from './dependency-injection/useService';

type AppProps = {
  // TODO: Is there a better way then suppressing this? See https://github.com/amosproj/amos-ss2021-project2-context-map/issues/24
  // eslint-disable-next-line react/require-default-props
  rnd?: RandomNumberGenerator;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function App(props: AppProps = {}) {
  const rnd = useService(RandomNumberGenerator, props.rnd);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello World {rnd.next(2, 3).toPrecision(3)}</p>
      </header>
    </div>
  );
}

export default App;
