import { GraphData } from 'react-graph-vis';
import * as vis from 'vis-network';
import { EdgeDescriptor } from '../../shared/entities';
import { NodeResultDescriptor, QueryResult } from '../../shared/queries';

function convertNode(node: NodeResultDescriptor): vis.Node {
  const result: vis.Node = {
    id: node.id,
    label: node.id.toString(),
    // Advanced stuff, like styling nodes with different types differently...
  };

  if (node.subsidiary) {
    result.color = 'yellow';
  }

  return result;
}

function convertNodes(nodes: NodeResultDescriptor[]): vis.Node[] {
  return nodes.map((node) => convertNode(node));
}

function convertEdge(edge: EdgeDescriptor): vis.Edge {
  return {
    id: edge.id,
    from: edge.from,
    to: edge.to,
    // Advanced stuff, like styling edges with different types differently...
  };
}

function convertEdges(edges: EdgeDescriptor[]): vis.Edge[] {
  return edges.map((edge) => convertEdge(edge));
}

export default function convertQueryResult(
  queryResult: QueryResult
): GraphData {
  return {
    nodes: convertNodes(queryResult.nodes),
    edges: convertEdges(queryResult.edges),
  };
}
