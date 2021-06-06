import { Edge } from '../../shared/entities';
import BaseEntityColorStore from './BaseEntityColorStore';

type EdgeType = Edge['type'];

export default class EdgeColorStore extends BaseEntityColorStore<EdgeType> {
  protected getTypeOfEntity(entityTypeId: EdgeType): string {
    return entityTypeId;
  }
}
