import React from "react";
import { Container } from "inversify";
import { ContainerBuilder } from "./ContainerBuilder";

let globalContainer: Container | null = null;

export function createContainer() {
    if(globalContainer === null) {
        const containerBuilder = new ContainerBuilder();

        // We do not need to synchronize, as JS is single threaded
        globalContainer = containerBuilder.buildContainer();
    }

    return globalContainer;
}

function createContext() : React.Context<Container>
{
    const container = createContainer();

    return React.createContext(container);
}

/**
 * The react context that can be used to retrieve the dependency injection container.
 */
export const DependencyInjectionContext = createContext();
