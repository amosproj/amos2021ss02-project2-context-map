/**
 * State of a property whose values are chosen in {@link FilterLineProperty}
 */
export interface FilterPropertyState {
  /**
   * Name of the property
   */
  name: string;

  /**
   * State of the values
   */
  values: string[];
}

/**
 * State of a filter line
 */
export interface FilterLineState {
  /**
   * Entity type of the filter line
   */
  type: string;

  /**
   * Signals if this filter line is to be added to the {@link FilterQueryStore}
   */
  isActive: boolean;

  /**
   * States of the properties
   */
  propertyFilters: FilterPropertyState[];
}

/**
 * State of a filter
 */
export class FilterState {
  constructor(
    private _edges: FilterLineState[],
    private _nodes: FilterLineState[]
  ) {}

  get edges(): FilterLineState[] {
    // eslint-disable-next-line no-underscore-dangle
    return this._edges;
  }

  get nodes(): FilterLineState[] {
    // eslint-disable-next-line no-underscore-dangle
    return this._nodes;
  }

  /**
   * Gets the isActive value of a {@link FilterLineState}.
   * @param filterLineType - filter line which is searched for
   * @param entity - specifies whether this entity is a node or an edge
   */
  public getFilterLineIsActive(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): boolean {
    const lineState: FilterLineState | undefined = this.getLineFromFilterState(
      filterLineType,
      entity
    );

    return lineState !== undefined ? lineState.isActive : false;
  }

  /**
   * Toggles the {@link isActive} property of the specified filter line.
   * @param filterLineType - filter line which {@link isActive} property is toggled
   * @param entity - specifies whether this entity is a node or an edge
   */
  public toggleFilterLineActive(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): void {
    const line: FilterLineState | undefined = this.getLineFromFilterState(
      filterLineType,
      entity
    );

    if (line) {
      line.isActive = !line.isActive;
    }
  }

  /**
   * Sets the {@link isActive} property of the specified filter line active.
   * @param filterLineType - filter line which {@link isActive} property is set active
   * @param entity - specifies whether this entity is a node or an edge
   */
  public setFilterLineActive(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): void {
    const line: FilterLineState | undefined = this.getLineFromFilterState(
      filterLineType,
      entity
    );

    if (line) {
      line.isActive = true;
    }
  }

  /**
   * Replaces {@link FilterPropertyState}s of the specified filter line.
   * @param statesToReplace - the {@link FilterPropertyState}s to be replaced
   * @param filterLineType - filter line which the {@link FilterPropertyState} is added to
   * @param entity - specifies whether this entity is a node or an edge
   */
  public replaceFilterPropertyStates(
    statesToReplace: FilterPropertyState[],
    filterLineType: string,
    entity: 'node' | 'edge'
  ): void {
    const lineState: FilterLineState | undefined = this.getLineFromFilterState(
      filterLineType,
      entity
    );

    if (lineState) {
      lineState.propertyFilters = statesToReplace;
    }
  }

  /**
   * Gets {@link FilterPropertyState}s of the specified filter line.
   * @param filterLineType - filter line which the {@link FilterPropertyState} is added to
   * @param entity - specifies whether this entity is a node or an edge
   */
  public getFilterPropertyStates(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): FilterPropertyState[] | undefined {
    const lineState: FilterLineState | undefined = this.getLineFromFilterState(
      filterLineType,
      entity
    );

    return lineState?.propertyFilters;
  }

  /**
   * Gets the values of a {@link FilterPropertyState} in the specified filter line if they exist.
   * Otherwise undefined is returned.
   * @param filterLineType - filter line which is searched for
   * @param filterPropertyName - name of the {@link FilterPropertyState}
   * @param entity - specifies whether this entity is a node or an edge
   */
  public getPropertyStateValues(
    filterLineType: string,
    filterPropertyName: string,
    entity: 'node' | 'edge'
  ): string[] | undefined {
    const propertyState: FilterPropertyState | undefined =
      this.searchForPropertyState(filterLineType, filterPropertyName, entity);

    return propertyState?.values;
  }

  private searchForPropertyState(
    filterLineType: string,
    filterPropertyName: string,
    entity: 'node' | 'edge'
  ) {
    const line: FilterLineState | undefined = this.getLineFromFilterState(
      filterLineType,
      entity
    );

    if (line) {
      for (const propertyFilters of line.propertyFilters) {
        if (propertyFilters.name === filterPropertyName) {
          return propertyFilters;
        }
      }
    }

    return undefined;
  }

  private getLineFromFilterState(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): FilterLineState | undefined {
    const entityLineStates = entity === 'node' ? this.nodes : this.edges;

    for (const entityLine of entityLineStates) {
      if (entityLine.type === filterLineType) {
        return entityLine;
      }
    }

    /* istanbul ignore next */
    return undefined;
  }
}
