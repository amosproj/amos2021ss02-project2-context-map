import { GraphData } from 'react-graph-vis';
import * as vis from 'vis-network';
import { EdgeDescriptor } from '../../shared/entities';
import { NodeResultDescriptor, QueryResult } from '../../shared/queries';
import NodeColorStore from '../../stores/colors/NodeColorStore';

const nodeColorStore = new NodeColorStore();
const colorize = nodeColorStore.getValue();

function convertNode(node: NodeResultDescriptor): vis.Node {
  const result: vis.Node = {
    id: node.id,
    label: node.id.toString(),
    color: colorize(node.types).color,
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
  const type = [edge.type];
  return {
    id: edge.id,
    from: edge.from,
    to: edge.to,
    color: colorize(type).toString(),
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
