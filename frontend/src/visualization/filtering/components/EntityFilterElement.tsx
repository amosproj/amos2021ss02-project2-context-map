import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import AddIcon from '@material-ui/icons/Add';
import { AsyncProps } from 'react-async';
import EntityFilterDialog from './dialog/EntityFilterDialog';
import { NodeTypeFilterModel } from '../../../shared/filter';
import { CancellationToken } from '../../../utils/CancellationToken';
import useService from '../../../dependency-injection/useService';
import { FilterService } from '../../../services/filter';
import fetchDataFromService from '../../shared-ops/FetchData';

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
 * A function that wraps the {@link getNodeTypeFilterModel} call to the filter-service to be usable with react-async.
 * @param props - The props that contains our parameter in an untyped way.
 * @returns A {@link Promise} representing the asynchronous operation. When evaluated, the promise result contains the nodeTypeFilterModel.
 */
function fetchNodeTypeFilterModel(
  props: AsyncProps<NodeTypeFilterModel>
): Promise<NodeTypeFilterModel> {
  const thisFilterService = props.service as FilterService;
  const cancellation = props.cancellation as CancellationToken;
  // TODO: find a way to give useAsync a parameter.
  return thisFilterService.getNodeTypeFilterModel('Category', cancellation);
}

const EntityFilterElement = (props: {
  backgroundColor: string;
  name: string;
}): JSX.Element => {
  const classes = useStyles();

  // Indicates if filter-dialog is opened.
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [boxShadow, setBoxShadow] = useState('None');

  const { backgroundColor, name } = props;

  const filterService = useService(FilterService, null);
  let data = fetchDataFromService(fetchNodeTypeFilterModel, filterService);

  // check if data is an JSX.Element -> is still loading or error.
  if (React.isValidElement(data)) {
    return data;
  }

  data = data as NodeTypeFilterModel;

  const entityTypeProperties = data.properties;

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
      <IconButton component="span">
        <TuneIcon onClick={handleOpenFilter} />
      </IconButton>
      <IconButton component="span">
        <AddIcon onClick={handleAddEntity} />
      </IconButton>
      <EntityFilterDialog
        filterOpen={filterOpen}
        handleCloseFilter={handleCloseFilter}
        entityTypes={entityTypeProperties}
      />
    </div>
  );
};

export default EntityFilterElement;
