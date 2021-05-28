import React from 'react';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import AddIcon from '@material-ui/icons/Add';
import EntityFilterDialog from './dialog/EntityFilterDialog';
import {
  EdgeTypeFilterModel,
  NodeTypeFilterModel,
} from '../../../shared/filter';
import { CancellationToken } from '../../../utils/CancellationToken';
import useService from '../../../dependency-injection/useService';
import { FilterService } from '../../../services/filter';
import { MatchAllCondition, OfTypeCondition } from '../../../shared/queries';
import fetchDataFromService from '../../shared-ops/fetchDataFromService';

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

const EntityFilterElement = (props: {
  backgroundColor: string;
  name: string;
  entity: 'node' | 'edge';
  setFilterQuery: (
    condition: MatchAllCondition | OfTypeCondition | null
  ) => void; // TODO: Rename
}): JSX.Element => {
  const classes = useStyles();

  // Indicates if filter-dialog is opened.
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [boxShadow, setBoxShadow] = React.useState('None');
  const isActive = React.useRef(false);

  // TODO: Rename
  const dialogConditionRef = React.useRef<MatchAllCondition | null>(null);

  const { backgroundColor, name, entity, setFilterQuery } = props;

  const filterService = useService(FilterService, null);

  // TODO: Rename
  function updateFilterQuery(): void {
    const propertiesCondition = dialogConditionRef.current;

    if (!isActive.current) {
      setFilterQuery(null);
      return;
    }

    const ofTypeCondition = OfTypeCondition(name);

    if (propertiesCondition === null) {
      setFilterQuery(ofTypeCondition);
    } else {
      setFilterQuery(MatchAllCondition(ofTypeCondition, propertiesCondition));
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
    };

    const filterModelEntries = model.properties;

    // TODO: Rename
    const dialogSetFilterQuery = (
      condition: MatchAllCondition | null
    ): void => {
      dialogConditionRef.current = condition;
      updateFilterQuery();
    };

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
        <EntityFilterDialog
          filterOpen={filterOpen}
          handleCloseFilter={handleCloseFilter}
          filterModelEntries={filterModelEntries}
          setFilterQuery={dialogSetFilterQuery}
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

export default EntityFilterElement;
