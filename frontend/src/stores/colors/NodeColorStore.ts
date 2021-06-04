import { Node } from '../../shared/entities';
import BaseEntityColorStore from './BaseEntityColorStore';

type NodeTypes = Node['types'];

export default class NodeColorStore extends BaseEntityColorStore<NodeTypes> {
  protected getTypeOfEntity(entityTypeId: NodeTypes): string {
    return entityTypeId.sort((a, b) => a.localeCompare(b)).join(' ');
  }
}
