import { EdgeDescriptor } from '../../shared/entities';
import BaseEntityColorStore, { EntityColorizer } from './BaseEntityColorStore';

export type EdgeColorizer = EntityColorizer<EdgeDescriptor>;

export default class EdgeColorStore extends BaseEntityColorStore<EdgeDescriptor> {
  protected getTypeOfEntity(edgeDescriptor: EdgeDescriptor): string {
    return edgeDescriptor.type;
  }
}
