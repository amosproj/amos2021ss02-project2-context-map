import { Box } from '@material-ui/core';
import React from 'react';
import { FilterCondition } from '../../../shared/queries';
import FilterEntityType from '../FilterEntityType';

const EntityTypeTemplate = (
  color: string,
  name: string,
  entity: 'node' | 'edge',
  entityConditionsRef: React.MutableRefObject<(FilterCondition | null)[]>,
  updateQuery: () => void,
  i: number
): JSX.Element => {
  const setEntryFilterCondition = (condition: FilterCondition | null): void => {
    const conditionsRef = entityConditionsRef;
    const conditions = conditionsRef.current;

    while (conditions.length - 1 < i) {
      conditions.push(null);
    }

    conditions[i] = condition;
    conditionsRef.current = conditions;
    updateQuery();
  };

  return (
    <div>
      <Box display="flex" p={1}>
        <FilterEntityType
          backgroundColor={color}
          name={name}
          entity={entity}
          setFilterQuery={setEntryFilterCondition}
        />
      </Box>
    </div>
  );
};

export default EntityTypeTemplate;
