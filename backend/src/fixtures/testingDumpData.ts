import { Node } from "../entities/Node";
import { Edge } from "../entities/Edge";
import { LimitQuery } from "../entities/queries/LimitQuery";


export class TestingDumpData {
  static nodes: Node[] = [{
    id: 1,
    labels: ["Person"],
    properties: { born: 1964, name: "Keanu Reeves" }
  },
    {
      id: 2,
      labels: ["Person"],
      properties: { born: 1967, name: "Carrie-Anne Moss" }
    },
    {
      id: 3,
      labels: ["Person"],
      properties: { born: 1965, name: "Lana Wachowski" }
    }];
  static edges: Edge[] = [
      {
        id: 1,
        from: 0,
        to: 2,
        properties: { roles: ["Trinity"] },
        type: 'ACTED_IN'
      },
      {
        id: 1,
        from: 2,
        to: 0,
        properties: { roles: ["Trinity"] },
        type: 'ACTED_IN'
      },
      { id: 2, from: 0, to: 3, properties: {}, type: 'DIRECTED' },
      { id: 2, from: 3, to: 0, properties: {}, type: 'DIRECTED' }
  ];

  static limitQuery: LimitQuery = { limit: { nodes: 3, edges: 4 } };

  static nodeIds = [ { id: 0 }, { id: 1 }, { id: 2 } ];

  static edgeIds = [
    { id: 0, from: 0, to: 1 },
    { id: 0, from: 1, to: 0 },
    { id: 1, from: 0, to: 2 },
    { id: 1, from: 2, to: 0 }
  ];
}
