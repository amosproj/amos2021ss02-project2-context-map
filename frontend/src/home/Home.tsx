import React from 'react';
import Button from '@material-ui/core/Button';
import logo from '../logo.svg';
import './Home.css';
import RandomNumberGenerator from '../services/RandomNumberGenerator';
import useService from '../dependency-injection/useService';
import SharedClass from '../shared/SharedClass';

type HomeProps = {
  // TODO: Is there a better way then suppressing this? See https://github.com/amosproj/amos-ss2021-project2-context-map/issues/24
  // eslint-disable-next-line react/require-default-props
  rnd?: RandomNumberGenerator;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function Home(props: HomeProps = {}) {
  const rnd = useService(RandomNumberGenerator, props.rnd);

  // This is here to test code sharing. Remove me when everything is working pls...
  const sharedThing = new SharedClass();
  sharedThing.doNothing();

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

export default Home;
