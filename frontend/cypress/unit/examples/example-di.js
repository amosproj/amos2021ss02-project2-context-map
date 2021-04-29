import React from 'react';
import { mount } from '@cypress/react';
import App from '../../../src/App';
import {
  createContainer,
  DependencyInjectionContext,
} from '../../../src/dependency-injection/DependencyInjectionContext';
import RandomNumberGenerator from '../../../src/services/RandomNumberGenerator';
import RandomNumberGeneratorFake from '../../fixtures/RandomNumberGeneratorFake';

describe('App', () => {
  it('Prints a fake random number', () => {
    // If the service 'RandomNumberGeneratorFake' is requested, return a fake implementation
    const container = createContainer();
    cy.stub(container, 'get')
      .withArgs(RandomNumberGenerator)
      .returns(new RandomNumberGeneratorFake(5.5555));

    // The 'fake' container must be provided in the di-context-provider
    mount(
      <DependencyInjectionContext.Provider value={container}>
        <App />
      </DependencyInjectionContext.Provider>
    );

    // Without the fake implementation there would be a number between 2 and 3 visible
    cy.contains('Hello World 5.56');
  });
});
