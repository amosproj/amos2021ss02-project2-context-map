import { Edge } from '../../shared/entities';

export interface EdgeDetails extends Edge {
  entityType: 'edge';
}

export function EdgeDetails(edge: Edge): EdgeDetails;
export function EdgeDetails(edge: Edge | null): EdgeDetails | null;
export function EdgeDetails(edge: Edge | null): EdgeDetails | null {
  if (edge === null) {
    return null;
  }
  return { ...edge, entityType: 'edge' };
}
