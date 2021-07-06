import { EdgeType } from '../../shared/schema';
import { EdgeDescriptor } from '../../shared/entities';

/**
 * Creates a dummy {@link EdgeDescriptor} from a given {@link EdgeType} with id, from,
 * and to value -1.
 * @param edgeType - {@link EdgeType} the {@link EdgeDescriptor} is created from.
 */
export default function createDummyEdgeFromType(
  edgeType: EdgeType
): EdgeDescriptor {
  return { id: -1, type: edgeType.name, from: -1, to: -1 };
}
