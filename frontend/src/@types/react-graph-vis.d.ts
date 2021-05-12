/*
 *  This file contains custom type definitions for the react-graph-vis package, as there are
 *  no type definitions available on NPM.
 */

declare module 'react-graph-vis' {
  import { Network, NetworkEvents, Options, Node, Edge, DataSet } from 'vis-network';
  import { Component } from 'react';
  export { Network, NetworkEvents, Options, Node, Edge, DataSet } from 'vis-network';

  /**
   * An object that has event name as keys and their callback as values that can be passed to the NetworkGraph component.
   * For the events available, see: https://visjs.github.io/vis-network/docs/network/#Events
   */
  export interface GraphEvents {
    [event: NetworkEvents]: (params?: any) => void;
  }

  /**
   * Contains the graph representation.
   */
  export interface GraphData {
    /**
     * An array of Node instances.
     */
    nodes: Node[];
    /**
     * An array of Edge instances.
     */
    edges: Edge[];
  }

  /**
   * Contains the properties of the NetworkGraph component.
   */
  export interface NetworkGraphProps {
    /**
     * The object that contains the graph data representing the graph.
     */
    graph: GraphData;

    /**
     * The vis-network options to apply.
     */
    options?: Options;

    /**
     * The events that shall be registered.
     */
    events?: GraphEvents;

    /**
     * A callback function that allows direct access to the underlying vis-network.
     */
    getNetwork?: (network: Network) => void;

    /**
     * The component identifier.
     */
    identifier?: string;
    style?: React.CSSProperties;
    getNodes?: (nodes: DataSet) => void;
    getEdges?: (edges: DataSet) => void;
  }

  /**
   * Contains the state of the NetworkGraph component.
   */
  export interface NetworkGraphState {
    /**
     * The component identifier.
     */
    identifier: string;
  }

  /**
   * A component that renders graphs via the vis-network library.
   */
  export default class NetworkGraph extends Component<
    NetworkGraphProps,
    NetworkGraphState
  > {
    render();
  }
}
