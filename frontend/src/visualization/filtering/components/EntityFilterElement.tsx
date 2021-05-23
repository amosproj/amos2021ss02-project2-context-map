import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import AddIcon from '@material-ui/icons/Add';
import { AsyncProps } from 'react-async';
import EntityFilterDialog from './dialog/EntityFilterDialog';
import {
  EdgeTypeFilterModel,
  NodeTypeFilterModel,
} from '../../../shared/filter';
import { CancellationToken } from '../../../utils/CancellationToken';
import useService from '../../../dependency-injection/useService';
import { FilterService } from '../../../services/filter';
import fetchDataFromService from '../../shared-ops/FetchData';
import { FilterQuery, QueryResult } from '../../../shared/queries';

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
  const filterService = props.service as FilterService;
  const nodeName = props.arg as string;
  const cancellation = props.cancellation as CancellationToken;
  return filterService.getNodeTypeFilterModel(nodeName, cancellation);
}

/**
 * A function that wraps the {@link getEdgeTypeFilterModel} call to the filter-service to be usable with react-async.
 * @param props - The props that contains our parameter in an untyped way.
 * @returns A {@link Promise} representing the asynchronous operation. When evaluated, the promise result contains the edgeTypeFilterModel.
 */
function fetchEdgeTypeFilterModel(
  props: AsyncProps<NodeTypeFilterModel>
): Promise<NodeTypeFilterModel> {
  const filterService = props.service as FilterService;
  const edgeName = props.arg as string;
  const cancellation = props.cancellation as CancellationToken;
  return filterService.getEdgeTypeFilterModel(edgeName, cancellation);
}

/**
 * A function that wraps the call to the filter-service to be usable with react-async.
 * @param props The props that contains our parameter in an untyped way.
 * @returns A {@link Promise} representing the asynchronous operation. When evaluated, the promise result contains the query result.
 */
function executeFilterQuery(
  props: AsyncProps<QueryResult>
): Promise<QueryResult> {
  const filterService = props.service as FilterService;
  const filterQuery = props.arg as FilterQuery;
  const cancellation = props.cancellation as CancellationToken;
  return filterService.query(filterQuery, cancellation);
}

const EntityFilterElement = (props: {
  backgroundColor: string;
  name: string;
  entity: 'node' | 'edge';
  filteredQueryResult: QueryResult;
  setFilteredQueryResult: React.Dispatch<React.SetStateAction<QueryResult>>;
}): JSX.Element => {
  const classes = useStyles();

  // the filterQuery from child-component Filter
  const [filterQuery, setFilterQuery] = useState<FilterQuery>({});

  // Indicates if filter-dialog is opened.
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [boxShadow, setBoxShadow] = useState('None');

  const {
    backgroundColor,
    name,
    entity,
    filteredQueryResult,
    setFilteredQueryResult,
  } = props;

  const filterService = useService(FilterService, null);
  let data = fetchDataFromService(
    entity === 'node' ? fetchNodeTypeFilterModel : fetchEdgeTypeFilterModel,
    filterService,
    name
  );

  // check if data is an JSX.Element -> is still loading or error.
  if (React.isValidElement(data)) {
    return data;
  }

  data =
    entity === 'node'
      ? (data as NodeTypeFilterModel)
      : (data as EdgeTypeFilterModel);

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
    // trigger convert filteredQueryResult to GraphData in Graph.txs here
    // const dataFilter = fetchDataFromService(
    //   executeFilterQuery,
    //   filterService,
    //   filterQuery
    // );
    //
    // // check if data is an JSX.Element -> is still loading or error.
    // if (React.isValidElement(dataFilter)) {
    //   return dataFilter;
    // }
    // setFilteredQueryResult(dataFilter as QueryResult);
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
        filterQuery={filterQuery}
        setFilterQuery={setFilterQuery}
      />
    </div>
  );
};

export default EntityFilterElement;
