import React from "react";
import TabDefinition from "./TabDefinition";

export default interface RouteDefinition {
  path: string;
  label: string;
  exact?: boolean | undefined;
  content: () => JSX.Element;
  tabs?: TabDefinition[] | undefined;
}
