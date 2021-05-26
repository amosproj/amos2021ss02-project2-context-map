import React from 'react';
import Button from '@material-ui/core/Button';
import logo from '../logo.svg';
import './Home.css';
import RandomNumberGenerator from '../services/RandomNumberGenerator';
import useService from '../dependency-injection/useService';

function Home(): JSX.Element {
  const rnd = useService(RandomNumberGenerator);

  return (
    <div className="Home">
      <header className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <Button variant="contained" color="primary">
          Hello World {rnd.next(2, 3).toPrecision(3)}
        </Button>
      </header>
    </div>
  );
}

Home.defaultProps = {
  rnd: undefined,
};

export default Home;
