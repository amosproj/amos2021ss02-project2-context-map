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
   * Adds a new {@link FilterPropertyState} to the specified filter line. If there already
   * exists a {@link FilterPropertyState} with the given name in the filter line, the
   * {@link FilterPropertyState} is overwritten with the new one.
   * @param stateToAdd - the {@link FilterPropertyState} to be added
   * @param filterLineType - filter line which the {@link FilterPropertyState} is added to
   * @param entity - specifies whether this entity is a node or an edge
   */
  public addFilterPropertyState(
    stateToAdd: FilterPropertyState,
    filterLineType: string,
    entity: 'node' | 'edge'
  ): void {
    const lineState: FilterLineState | undefined = this.getLineFromFilterState(
      filterLineType,
      entity
    );

    if (lineState) {
      const propertyWithExistentName = lineState.propertyFilters.find(
        (e) => e.name === stateToAdd.name
      );
      if (propertyWithExistentName) {
        propertyWithExistentName.values = stateToAdd.values;
      } else {
        lineState.propertyFilters.push(stateToAdd);
      }
    }
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
