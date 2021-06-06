import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import AddIcon from '@material-ui/icons/Add';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import FilterLineProperties from './FilterLineProperties';
import useService from '../../dependency-injection/useService';
import { FilterService } from '../../services/filter';
import { EdgeTypeFilterModel, NodeTypeFilterModel } from '../../shared/filter';
import FilterQueryStore from '../../stores/FilterQueryStore';
import FilterStateStore from '../../stores/filterState/FilterStateStore';
import useObservable from '../../utils/useObservable';
import withLoadingBar from '../../utils/withLoadingBar';
import withErrorHandler from '../../utils/withErrorHandler';
import LoadingStore from '../../stores/LoadingStore';
import ErrorStore from '../../stores/ErrorStore';

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

const FilterLine = (props: {
  backgroundColor: string;
  type: string;
  entity: 'node' | 'edge';
}): JSX.Element => {
  const classes = useStyles();
  const { backgroundColor, type, entity } = props;

  // Indicates if filter-dialog is opened.
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [boxShadow, setBoxShadow] = React.useState('None');
  const isActive = React.useRef(false);

  const filterService = useService(FilterService, null);

  const filterQueryStore = useService<FilterQueryStore>(FilterQueryStore);
  const filterStateStore = useService<FilterStateStore>(FilterStateStore);

  const loadingStore = useService<LoadingStore>(LoadingStore);
  const errorStore = useService<ErrorStore>(ErrorStore);

  const [filterModel, setFilterModel] = useState<EntityTypeFilterModel>({
    name: '',
    properties: [],
  });

  useObservable(
    from(
      entity === 'node'
        ? filterService.getNodeTypeFilterModel(type)
        : filterService.getEdgeTypeFilterModel(type)
    ).pipe(
      withLoadingBar({ loadingStore }),
      withErrorHandler({ rethrow: true, errorStore }),
      tap((model) => {
        setFilterModel(model);
      })
    )
  );

  function updateBoxShadow() {
    if (isActive.current) {
      setBoxShadow('0 0 0 0.2rem rgba(0,123,255,.5)');
    } else {
      setBoxShadow('None');
    }
  }

  const handleOpenFilter = () => {
    setFilterOpen(true);
  };
  const handleCloseFilter = () => {
    setFilterOpen(false);
  };

  const handleAddEntity = () => {
    isActive.current = !isActive.current;

    updateBoxShadow();
    filterStateStore.toggleFilterLineActive(type, entity);
    filterQueryStore.update();
  };

  const filterModelEntries = filterModel.properties;

  return (
    <div>
      <Button
        style={{ backgroundColor, boxShadow }}
        variant="contained"
        color="primary"
        disableRipple
        className={classes.root}
      >
        {type}
      </Button>
      <IconButton component="span" className="FilterButton">
        <TuneIcon onClick={handleOpenFilter} />
      </IconButton>
      <IconButton component="span" className="AddButton">
        <AddIcon onClick={handleAddEntity} />
      </IconButton>
      <FilterLineProperties
        filterOpen={filterOpen}
        handleCloseFilter={handleCloseFilter}
        filterModelEntries={filterModelEntries}
        filterLineType={type}
        entity={entity}
      />
    </div>
  );
};

export default FilterLine;
