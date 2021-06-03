import React from 'react';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import AddIcon from '@material-ui/icons/Add';
import { tap } from 'rxjs/operators';
import FilterEntityTypeProperties from './FilterEntityTypeProperties';
import { CancellationToken } from '../../utils/CancellationToken';
import useService from '../../dependency-injection/useService';
import { FilterService } from '../../services/filter';
import fetchDataFromService from '../shared-ops/fetchDataFromService';
import {
  FilterCondition,
  MatchAllCondition,
  MatchAnyCondition,
  OfTypeCondition,
} from '../../shared/queries';
import { EdgeTypeFilterModel, NodeTypeFilterModel } from '../../shared/filter';
import useObservable from '../../utils/useObservable';
import NodeFilterConditionStore from '../../stores/NodeFilterConditionStore';
import EdgeFilterConditionStore from '../../stores/EdgeFilterConditionStore';
import FilterQueryStore from '../../stores/FilterQueryStore';

type EntityTypeFilterModel = NodeTypeFilterModel | EdgeTypeFilterModel;

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: 150,
      boxShadow: 'none',
      textTransform: 'none',
      fontSize: 16,
      padding: '6px 12px',
      border: '1px solid',
      lineHeight: 1.5,
      '&:hover': {
        boxShadow: 'none',
      },
    },
  })
);

/**
 * fetches a nodeTypeFilterModel with the filterService
 *
 * @param filterService - the filterService the data is fetched from
 * @param nodeName - the name of the node of the nodeTypeFilterModel
 * @param cancellation - the cancellation token
 * @returns the nodeTypeFilterModel
 */
function fetchNodeTypeFilterModel(
  filterService: FilterService,
  nodeName: string,
  cancellation: CancellationToken
): Promise<NodeTypeFilterModel> {
  return filterService.getNodeTypeFilterModel(nodeName, cancellation);
}

/**
 * fetches a edgeTypeFilterModel with the filterService
 *
 * @param filterService - the filterService the data is fetched from
 * @param edgeName - the name of the edge of the edgeTypeFilterModel
 * @param cancellation - the cancellation token
 * @returns the edgeTypeFilterModel
 */
function fetchEdgeTypeFilterModel(
  filterService: FilterService,
  edgeName: string,
  cancellation: CancellationToken
): Promise<NodeTypeFilterModel> {
  return filterService.getEdgeTypeFilterModel(edgeName, cancellation);
}

const FilterEntityType = (props: {
  backgroundColor: string;
  name: string;
  entity: 'node' | 'edge';
}): JSX.Element => {
  const classes = useStyles();
  const { backgroundColor, name, entity } = props;

  // Indicates if filter-dialog is opened.
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [boxShadow, setBoxShadow] = React.useState('None');
  const isActive = React.useRef(false);

  const entityFilterConditionStore =
    entity === 'node'
      ? useService<NodeFilterConditionStore>(NodeFilterConditionStore)
      : useService<EdgeFilterConditionStore>(EdgeFilterConditionStore);

  const filterService = useService(FilterService, null);

  const [propertiesCondition, setPropertiesCondition] =
    React.useState<FilterCondition | null>(null);
  useObservable(
    entityFilterConditionStore.getState().pipe(
      tap((filterCondition: FilterCondition) => {
        // Convert the query result to an object, react-graph-vis understands.
        setPropertiesCondition(filterCondition);
      })
    )
  );

  const filterStore = useService(FilterQueryStore);

  const nodeFilterConditionStore = useService<NodeFilterConditionStore>(
    NodeFilterConditionStore
  );

  const edgeFilterConditionStore = useService<EdgeFilterConditionStore>(
    EdgeFilterConditionStore
  );

  const nodeConditions: FilterCondition[] = [];
  useObservable(
    nodeFilterConditionStore.getState().pipe(
      tap((filterCondition: FilterCondition) => {
        // Convert the query result to an object, react-graph-vis understands.
        nodeConditions.push(filterCondition);
      })
    )
  );

  const edgeConditions: FilterCondition[] = [];
  useObservable(
    edgeFilterConditionStore.getState().pipe(
      tap((filterCondition: FilterCondition) => {
        // Convert the query result to an object, react-graph-vis understands.
        edgeConditions.push(filterCondition);
      })
    )
  );

  function updateQuery() {
    const filters: { nodes?: FilterCondition; edges?: FilterCondition } = {};

    if (nodeConditions.length > 0) {
      filters.nodes = MatchAnyCondition(...nodeConditions);
    }

    if (edgeConditions.length > 0) {
      filters.edges = MatchAnyCondition(...edgeConditions);
    }
    // TODO: Make limits configurable
    filterStore.mergeState({ filters });
  }

  // TODO: Rename
  function updateFilterQuery(): void {
    const ofTypeCondition = OfTypeCondition(name);

    // Convert the query result to an object, react-graph-vis understands.
    if (propertiesCondition === null) {
      entityFilterConditionStore.mergeState(ofTypeCondition);
    } else {
      entityFilterConditionStore.mergeState(
        MatchAllCondition(ofTypeCondition, propertiesCondition)
      );
    }
  }

  function updateBoxShadow() {
    if (isActive.current) {
      setBoxShadow('0 0 0 0.2rem rgba(0,123,255,.5)');
    } else {
      setBoxShadow('None');
    }
  }

  function renderContent(model: EntityTypeFilterModel): JSX.Element {
    const handleOpenFilter = () => {
      setFilterOpen(true);
    };
    const handleCloseFilter = () => {
      setFilterOpen(false);
    };

    const handleAddEntity = () => {
      isActive.current = !isActive.current;

      updateFilterQuery();
      updateBoxShadow();
      updateQuery();
    };

    const filterModelEntries = model.properties;

    return (
      <div>
        <Button
          style={{ backgroundColor, boxShadow }}
          variant="contained"
          color="primary"
          disableRipple
          className={classes.root}
        >
          {name}
        </Button>
        <IconButton component="span" className="FilterButton">
          <TuneIcon onClick={handleOpenFilter} />
        </IconButton>
        <IconButton component="span" className="AddButton">
          <AddIcon onClick={handleAddEntity} />
        </IconButton>
        <FilterEntityTypeProperties
          filterOpen={filterOpen}
          handleCloseFilter={handleCloseFilter}
          filterModelEntries={filterModelEntries}
          entity={entity}
        />
      </div>
    );
  }

  return fetchDataFromService(
    entity === 'node' ? fetchNodeTypeFilterModel : fetchEdgeTypeFilterModel,
    renderContent,
    filterService,
    name
  );
};

export default FilterEntityType;
