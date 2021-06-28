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
    private edgesInternal: FilterLineState[],
    private nodesInternal: FilterLineState[]
  ) {}

  get edges(): FilterLineState[] {
    return this.edgesInternal;
  }

  get nodes(): FilterLineState[] {
    return this.nodesInternal;
  }

  /**
   * Gets the isActive value of a {@link FilterLineState}.
   * @param filterLineType - filter line which is searched for. The type of the entity.
   * @param entity - specifies whether this entity is a node or an edge
   */
  public isFilterLineActive(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): boolean {
    const lineState = this.getFilterLine(filterLineType, entity);

    return lineState?.isActive ?? false;
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
    const line = this.getFilterLine(filterLineType, entity);

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
    const line = this.getFilterLine(filterLineType, entity);

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
    const lineState = this.getFilterLine(filterLineType, entity);

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
    const lineState = this.getFilterLine(filterLineType, entity);

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
    const propertyState = this.getPropertyState(
      filterLineType,
      filterPropertyName,
      entity
    );

    return propertyState?.values;
  }

  private getPropertyState(
    filterLineType: string,
    filterPropertyName: string,
    entity: 'node' | 'edge'
  ): FilterPropertyState | undefined {
    const line: FilterLineState | undefined = this.getFilterLine(
      filterLineType,
      entity
    );

    return line?.propertyFilters.find(
      (propertyFilter) => propertyFilter.name === filterPropertyName
    );
  }

  private getFilterLine(
    filterLineType: string,
    entity: 'node' | 'edge'
  ): FilterLineState | undefined {
    const entityLineStates = entity === 'node' ? this.nodes : this.edges;

    return entityLineStates.find(
      (entityLine) => entityLine.type === filterLineType
    );
  }
}
