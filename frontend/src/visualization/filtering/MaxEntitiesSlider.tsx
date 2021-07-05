import React from 'react';
import { Slider } from '@material-ui/core';
import { filter } from 'rxjs/operators';
import useService from '../../dependency-injection/useService';
import { QueryService } from '../../services/query';
import LoadingStore from '../../stores/LoadingStore';
import ErrorStore from '../../stores/ErrorStore';
import useObservable from '../../utils/useObservable';
import withLoadingBar from '../../utils/withLoadingBar';
import withErrorHandler from '../../utils/withErrorHandler';
import FilterQueryStore from '../../stores/FilterQueryStore';
import EntityQueryLimitStore from '../../stores/EntityQueryLimitStore';

type Props = {
  entities: 'nodes' | 'edges';
};

/**
 * Slider that limits the number of nodes/edges by modifying the state in the
 * {@link FilterQueryStore}.
 * @param entities whether edges or nodes are controlled by the slider
 */
export default function MaxEntitiesSlider({ entities }: Props): JSX.Element {
  const queryService = useService(QueryService);
  const filterQueryStore = useService(FilterQueryStore);
  const entityCountsStore = useService(EntityQueryLimitStore);
  const loadingStore = useService(LoadingStore);
  const errorStore = useService(ErrorStore);

  // current value of the slider
  const [value, setValue] = React.useState<number>(
    entityCountsStore.getValue().nodes
  );

  // number of edges and nodes
  const counts = useObservable(
    // load max number of entities on mount
    queryService.getNumberOfEntities().pipe(
      withLoadingBar({ loadingStore }),
      withErrorHandler({ errorStore }),
      filter((next) => next !== null)
    ),
    { nodes: 150, edges: 150 }
  );

  // max number that can be selected with the slider
  const max = counts[entities];

  // determines the label of the slider popup (is open on drag)
  const getLabel = (val: number) => {
    if (val >= max) {
      return 'all';
    }
    return val;
  };

  // Updates the state
  const update = (val: number) => {
    const filterLimits = entityCountsStore.getValue();
    filterLimits[entities] = val;
    entityCountsStore.setState(filterLimits);
    filterQueryStore.mergeState(filterQueryStore.getValue());
  };

  return (
    <>
      Number of {entities === 'edges' ? 'Edges' : 'Nodes'}
      <Slider
        aria-label="Max Nodes"
        value={value}
        max={max}
        valueLabelDisplay="auto"
        valueLabelFormat={getLabel}
        onChange={(_, val) => {
          setValue(val as number);
        }}
        onChangeCommitted={(_, val) => update(val as number)}
        className={`${entities}-slider`}
      />
    </>
  );
}
