import React, { useState } from 'react';
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
import { FilterQuery } from '../../../shared/queries';
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
  setFilterQuery: React.Dispatch<React.SetStateAction<FilterQuery>>;
  updateGraph: () => void;
}): JSX.Element => {
  const classes = useStyles();

  // Indicates if filter-dialog is opened.
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [boxShadow, setBoxShadow] = useState('None');

  const { backgroundColor, name, entity, setFilterQuery, updateGraph } = props;

  const filterService = useService(FilterService, null);

  function renderContent(model: EntityTypeFilterModel): JSX.Element {
    const handleOpenFilter = () => {
      setFilterOpen(true);
    };
    const handleCloseFilter = () => {
      setFilterOpen(false);
    };

    const handleAddEntity = () => {
      setBoxShadow(
        boxShadow === 'None' ? '0 0 0 0.2rem rgba(0,123,255,.5)' : 'None'
      );
      updateGraph();
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
        <IconButton component="span">
          <TuneIcon onClick={handleOpenFilter} />
        </IconButton>
        <IconButton component="span">
          <AddIcon onClick={handleAddEntity} />
        </IconButton>
        <EntityFilterDialog
          name={name}
          filterOpen={filterOpen}
          handleCloseFilter={handleCloseFilter}
          entity={entity}
          filterModelEntries={filterModelEntries}
          setFilterQuery={setFilterQuery}
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
