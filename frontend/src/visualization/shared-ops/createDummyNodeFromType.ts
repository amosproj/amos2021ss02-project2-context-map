import { NodeType } from '../../shared/schema';
import { NodeDescriptor } from '../../shared/entities';

/**
 * Creates a dummy {@link NodeDescriptor} from a given {@link NodeType} with id value -1.
 * @param nodeType - {@link NodeType} the {@link NodeDescriptor} is created from.
 */
export default function createDummyNodeFromType(
  nodeType: NodeType
): NodeDescriptor {
  return { id: -1, types: [nodeType.name] };
}
