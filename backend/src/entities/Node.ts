/**
 * Represents a node of a graph
 */
export class Node {
  id: number;
  labels: string[];
  properties: {
    // TODO Find out which types are possible
    [key: string]: string | number | unknown;
  };
}
