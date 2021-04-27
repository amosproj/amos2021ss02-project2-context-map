import React, { useContext } from "react";
import { RandomNumberGeneratorImpl } from "../services/RandomNumberGeneratorImpl";

// This is just a fake implementation until we select and integrate a true DI container.
export class DIContainer {
    public getService<T>() : T {
        return <T><unknown>(new RandomNumberGeneratorImpl());
    }
}

export const DIContainerImpl = new DIContainer();

function createContext() : React.Context<DIContainer>
{
    return React.createContext(DIContainerImpl);
}

export const DependencyInjectionContext = createContext();

