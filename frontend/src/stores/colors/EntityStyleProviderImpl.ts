import 'reflect-metadata';
import { common } from '@material-ui/core/colors';
import { NodeStyle, EdgeStyle } from './EntityStyle';
import { EntityStyleProvider } from './EntityStyleProvider';
import getNthColor from './getNthColor';
import { EdgeDescriptor, NodeDescriptor } from '../../shared/entities';
import { ArgumentError } from '../../shared/errors';
import { QueryNodeResult, QueryEdgeResult } from '../../shared/queries';
import getTextColor from './getTextColor';
import EntityStyleStore from './EntityStyleStore';

type EntityStyleIntersection = NodeStyle & EdgeStyle;
type QueryEntityResult = QueryNodeResult | QueryEdgeResult;

const isEdgeDescriptor = (
  e: EdgeDescriptor | NodeDescriptor
): e is EdgeDescriptor => 'type' in e;

const isNodeDescriptor = (
  e: EdgeDescriptor | NodeDescriptor
): e is NodeDescriptor => 'types' in e;

/**
 * Defines the coloring definition for nodes and edges.
 *
 * If entity is subsidiary:
 *   If entity is Node: colored border, white background
 *   If entity is Edge: black edge
 */
export class EntityStyleProviderImpl implements EntityStyleProvider {
  protected readonly entityTypeColorMap = new Map<string, string>();
  public constructor(private readonly entityStyleStore: EntityStyleStore) {}

  public getStyle(entity: QueryEntityResult): EntityStyleIntersection {
    const ret: EntityStyleIntersection = {
      color: common.black,
      text: { color: common.black },
      stroke: {
        width: 1,
        dashes: false,
        color: common.black,
      },
    };

    const type = this.getTypeOfEntity(entity);
    let mainColor;
    if (
      isEdgeDescriptor(entity) &&
      this.entityStyleStore.getGreyScaleEdgesValue()
    ) {
      mainColor = common.black;
    } else {
      mainColor = this.entityTypeColorMap.get(type);
    }

    if (!mainColor) {
      // main color not yet found for this entity type
      mainColor = getNthColor(this.entityTypeColorMap.size);
      this.entityTypeColorMap.set(type, mainColor);
    }

    // Coloring if entity is subsidiary
    if (this.isSubsidiary(entity)) {
      // Set border color to main color.
      ret.stroke.color = mainColor;
      if (isNodeDescriptor(entity)) {
        // Fill nodes white
        ret.color = common.white;
      }
    } else {
      // Set color = borderColor = mainColor
      ret.color = mainColor;
      // TODO: Use a color with less contrast. Maybe mix the background-color with black.
      ret.stroke.color = common.black;
    }

    if (this.isPath(entity)) {
      ret.stroke.width = 3;
    }

    if (this.isVirtual(entity)) {
      ret.stroke.dashes = [3, 3];
    }

    // Will also return NodeStyle for Edges in contrast to
    // the type definition.
    // This is done for simplicity. If the return type is computed differently,
    // this function will be much more complex.
    // However, the type definition ensures that callers that call this function
    // with an EdgeDescriptor will 'see' only an EntityStyle.
    ret.text.color = getTextColor(ret.color);
    return ret;
  }

  protected getTypeOfEntity(entity: QueryEntityResult): string {
    if (isEdgeDescriptor(entity)) {
      return `EDGE ${entity.type}`;
    }
    if (isNodeDescriptor(entity)) {
      return `NODE ${entity.types
        .map((x) => x)
        .sort((a, b) => a.localeCompare(b))
        .join(' ')}`;
    }
    /* istanbul ignore next */
    throw new ArgumentError('Argument is neither a node nor an edge');
  }

  /**
   * Returns true if parameter is subsidiary.
   * @private
   */
  private isSubsidiary(entity: QueryEntityResult): boolean {
    return entity.subsidiary === true;
  }

  private isPath(entity: QueryEntityResult): boolean {
    return entity.isPath === true;
  }

  private isVirtual(entity: QueryEntityResult): boolean {
    return entity.virtual === true;
  }
}

export default EntityStyleProviderImpl;
