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
import EntityCountsStore from '../../stores/EntityCountsStore';

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
  const entityCountsStore = useService(EntityCountsStore);
  const loadingStore = useService(LoadingStore);
  const errorStore = useService(ErrorStore);

  const [value, setValue] = React.useState<number>(150);

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
    const filterLimits = filterQueryStore.getValue().limits ?? {};

    if (val >= max) {
      // If selected filter >= max number of entities => delete that filter
      delete filterLimits[entities];
    } else {
      // else add filter
      filterLimits[entities] = val;
    }
    filterQueryStore.mergeState({ limits: filterLimits });
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
          entityCountsStore.setState({
            nodes: val as number,
            edges: val as number,
          });
          setValue(val as number);
        }}
        onChangeCommitted={(_, val) => update(val as number)}
        className={`${entities}-slider`}
      />
    </>
  );
}
