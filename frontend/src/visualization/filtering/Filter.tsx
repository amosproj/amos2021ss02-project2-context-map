import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { tap } from 'rxjs/operators';
import { forkJoin, from } from 'rxjs';
import useService from '../../dependency-injection/useService';
import entityColors from '../data/GraphData';
import { SchemaService } from '../../services/schema';
import MaxEntitiesSlider from './MaxEntitiesSlider';
import { EdgeType, NodeType } from '../../shared/schema';
import EntityTypeTemplate from './helpers/EntityTypeTemplate';
import FilterStateStore, {
  FilterLineState,
} from '../../stores/FilterStateStore';
import useObservable from '../../utils/useObservable';
import withLoadingBar from '../../utils/withLoadingBar';
import withErrorHandler from '../../utils/withErrorHandler';
import LoadingStore from '../../stores/LoadingStore';
import ErrorStore from '../../stores/ErrorStore';

const useStyles = makeStyles((theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-start',
    },
  })
);

// Tab utils from https://material-ui.com/components/tabs/
interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
    >
      <Box p={3}>
        <Typography>{children}</Typography>
      </Box>
    </div>
  );
}

const Filter = (): JSX.Element => {
  // hooks
  const classes = useStyles();
  const [tabIndex, setTabIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const filterStateStore = useService<FilterStateStore>(FilterStateStore);

  const schemaService = useService(SchemaService, null);

  const [schema, setSchema] = useState<{
    nodes: NodeType[];
    edges: EdgeType[];
  }>({ nodes: [], edges: [] });

  const loadingStore = useService<LoadingStore>(LoadingStore);
  const errorStore = useService<ErrorStore>(ErrorStore);

  useObservable(
    forkJoin([
      from(schemaService.getNodeTypes()),
      from(schemaService.getEdgeTypes()),
    ]).pipe(
      withLoadingBar({ loadingStore }),
      withErrorHandler({ rethrow: true, errorStore }),
      tap((schemaFromService) => {
        setSchema({ nodes: schemaFromService[0], edges: schemaFromService[1] });
      })
    )
  );

  const nodeLineStates: FilterLineState[] = [];
  const edgeLineStates: FilterLineState[] = [];

  for (const nodeTypes of schema.nodes) {
    nodeLineStates.push({
      type: nodeTypes.name,
      isActive: false,
      propertyFilters: [],
    });
  }

  for (const edgeTypes of schema.edges) {
    edgeLineStates.push({
      type: edgeTypes.name,
      isActive: false,
      propertyFilters: [],
    });
  }

  filterStateStore.mergeState({ nodes: nodeLineStates, edges: edgeLineStates });

  const nodes = (
    <>
      {schema.nodes.map((type, i) =>
        EntityTypeTemplate(
          entityColors[i % entityColors.length],
          type.name,
          'node'
        )
      )}
    </>
  );
  const edges = (
    <>
      {schema.edges.map((type) =>
        EntityTypeTemplate('#a9a9a9', type.name, 'edge')
      )}
    </>
  );

  const handleChange = (
    event: React.ChangeEvent<Record<string, unknown>>,
    newValue: number
  ) => {
    setTabIndex(newValue);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className="Filter">
      <AppBar color="default" className={classes.appBar}>
        <IconButton color="inherit" onClick={handleDrawerOpen}>
          <ChevronLeftIcon />
        </IconButton>
      </AppBar>
      <Drawer variant="persistent" anchor="right" open={open}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose} className="closeFilter">
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <AppBar color="default" className={classes.appBar}>
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Node Types" className="NodeTypes" />
            <Tab label="Edge Types" className="EdgeTypes" />
          </Tabs>
        </AppBar>
        <List style={{ maxHeight: '94%', width: 320, overflow: 'auto' }}>
          <TabPanel value={tabIndex} index={0}>
            {nodes}
            <MaxEntitiesSlider entities="nodes" />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            {edges}
            <MaxEntitiesSlider entities="edges" />
          </TabPanel>
        </List>
      </Drawer>
    </div>
  );
};

export default Filter;
