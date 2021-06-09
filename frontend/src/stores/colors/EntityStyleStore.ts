import 'reflect-metadata';
import { injectable } from 'inversify';
import { BehaviorSubject, Observable } from 'rxjs';
import { common } from '@material-ui/core/colors';
import { NodeStyle } from './EntityStyle';
import getNthColor from './getNthColor';
import { EdgeDescriptor, NodeDescriptor } from '../../shared/entities';
import { ArgumentError } from '../../shared/errors';
import { QueryNodeResult, QueryEdgeResult } from '../../shared/queries';
import getTextColor from './getTextColor';
import { EntityStyleProvider } from './EntityStyleProvider';

const isEdgeDescriptor = (
  e: EdgeDescriptor | NodeDescriptor
): e is EdgeDescriptor => 'type' in e;

const isNodeDescriptor = (
  e: EdgeDescriptor | NodeDescriptor
): e is NodeDescriptor => 'types' in e;

export type Entity = QueryNodeResult | QueryEdgeResult;

/**
 * A simple store contains a single state.
 * The current state can be retrieved with {@link getValue} (just once)
 * and with {@link getState} (until unsubscribed).
 */
@injectable()
export class EntityStyleStore {
  protected readonly entityTypeColorMap = new Map<string, string>();

  /**
   * Contains the state.
   * Returns the current state immediately after subscribing.
   * @protected
   */
  protected readonly storeSubject = new BehaviorSubject<EntityStyleProvider>(
    this.getEntityColorizer()
  );

  /**
   * Returns the entity colorizing function.
   * @protected
   */
  protected getEntityColorizer(): EntityStyleProvider {
    /**
     * Defines the coloring definition for nodes and edges.
     *
     * If entity is subsidiary:
     *   If entity is Node: colored border, white background
     *   If entity is Edge: black edge
     */
    return {
      getStyle: (entity: Entity) => {
        const ret: NodeStyle = {
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
        if (isEdgeDescriptor(entity) && this.greyScaleEdges.value) {
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
      },
    };
  }

  protected getTypeOfEntity(entity: Entity): string {
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
  private isSubsidiary(entity: Entity): boolean {
    return entity.subsidiary === true;
  }

  private isPath(entity: Entity): boolean {
    return entity.isPath === true;
  }

  private isVirtual(entity: Entity): boolean {
    return entity.virtual === true;
  }

  /**
   * Returns an observable that outputs the stored value.
   */
  public getState(): Observable<EntityStyleProvider> {
    return this.storeSubject.pipe();
  }

  /**
   * Returns the current value of the stored value.
   */
  public getValue(): EntityStyleProvider {
    return this.storeSubject.value;
  }

  private readonly greyScaleEdges = new BehaviorSubject<boolean>(false);

  /**
   * Getter for greyScaleEdges property
   * @returns An Observable holding a boolean determining whether edges should be in greyscale or colored
   */
  public getGreyScaleEdges(): Observable<boolean> {
    return this.greyScaleEdges.pipe();
  }

  public setGreyScaleEdges(greyScale: boolean): void {
    this.greyScaleEdges.next(greyScale);
    this.storeSubject.next(this.getEntityColorizer());
  }
}

export default EntityStyleStore;
