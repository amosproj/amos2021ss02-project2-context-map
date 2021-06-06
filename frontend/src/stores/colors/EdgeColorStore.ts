import { EdgeDescriptor } from '../../shared/entities';
import BaseEntityColorStore from './BaseEntityColorStore';

export default class EdgeColorStore extends BaseEntityColorStore<EdgeDescriptor> {
  protected getTypeOfEntity(edgeDescriptor: EdgeDescriptor): string {
    return edgeDescriptor.type;
  }
}
