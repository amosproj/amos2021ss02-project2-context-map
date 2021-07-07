import { Node } from '../../shared/entities';

export interface NodeDetails extends Node {
  entityType: 'node';
}

export function NodeDetails(node: Node): NodeDetails;
export function NodeDetails(node: Node | null): NodeDetails | null;
export function NodeDetails(node: Node | null): NodeDetails | null {
  if (node === null) {
    return null;
  }
  return { ...node, entityType: 'node' };
}
