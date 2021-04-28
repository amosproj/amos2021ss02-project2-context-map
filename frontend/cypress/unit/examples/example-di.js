import React from 'react';
import {mount} from "@cypress/react";
import App from "../../../src/App";
import {createContainer, DependencyInjectionContext} from "../../../src/dependency-injection/DependencyInjectionContext";
import RandomNumberGenerator from "../../../src/services/RandomNumberGenerator";
import RandomNumberGeneratorFake from "../../fixtures/RandomNumberGeneratorFake";

describe("App", () => {
  it('Prints a fake random number', function () {
    // Wenn der Service 'RandomNumberGenerator' angefragt wird, wird immer eine fake Implementierung zurückgegeben
    const container = createContainer();
    cy.stub(container, "get")
      .withArgs(RandomNumberGenerator).returns(new RandomNumberGeneratorFake(5.5555))

    // Der "Fake-Container" muss im DI-Context übergeben werden
    mount(
      <DependencyInjectionContext.Provider value={container}>
        <App/>
      </DependencyInjectionContext.Provider>
    )

    // Ohne die fake Implementierung würde hier eine Zahl < 3 stehen
    cy.contains("Hello World 5.56");
  });
});
