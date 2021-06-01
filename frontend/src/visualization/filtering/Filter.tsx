import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  Tab,
  Tabs,
  Typography,
  Divider,
} from '@material-ui/core';
import React, { useRef } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import useService from '../../dependency-injection/useService';
import { CancellationToken } from '../../utils/CancellationToken';
import { NodeType, EdgeType } from '../../shared/schema';
import fetchDataFromService from '../shared-ops/fetchDataFromService';
import entityColors from '../data/GraphData';
import { SchemaService } from '../../services/schema';
import {
  FilterCondition,
  FilterQuery,
  MatchAnyCondition,
} from '../../shared/queries';
import EntityTypeTemplate from './helpers/EntityTypeTemplate';

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

/**
 * Fetches nodeTypes from the schemaService.
 *
 * @param schemaService - the schemaService the data is fetched from
 * @param cancellation - the cancellation token
 */
function fetchNodeTypes(
  schemaService: SchemaService,
  cancellation: CancellationToken
): Promise<NodeType[]> {
  return schemaService.getNodeTypes(cancellation);
}

/**
 * Fetches edgeTypes from the schemaService.
 *
 * @param schemaService - the schemaService the data is fetched from
 * @param cancellation - the cancellation token
 */
function fetchEdgeTypes(
  schemaService: SchemaService,
  cancellation: CancellationToken
): Promise<EdgeType[]> {
  return schemaService.getEdgeTypes(cancellation);
}

const Filter = (props: {
  executeQuery: (query: FilterQuery) => void;
}): JSX.Element => {
  // hooks
  const classes = useStyles();
  const [tabIndex, setTabIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const { executeQuery } = props;
  const schemaService = useService(SchemaService, null);

  const nodeConditionsRef = useRef<(FilterCondition | null)[]>([]);
  const edgeConditionsRef = useRef<(FilterCondition | null)[]>([]);

  function updateQuery() {
    const nodeConditions = nodeConditionsRef.current.filter(
      (condition) => condition !== null
    ) as FilterCondition[];

    const edgeConditions = edgeConditionsRef.current.filter(
      (condition) => condition !== null
    ) as FilterCondition[];

    const filters: { nodes?: FilterCondition; edges?: FilterCondition } = {};

    if (nodeConditions.length > 0) {
      filters.nodes = MatchAnyCondition(...nodeConditions);
    }

    if (edgeConditions.length > 0) {
      filters.edges = MatchAnyCondition(...edgeConditions);
    }

    // TODO: Make limits configurable
    executeQuery({ filters, limits: { edges: 250 } });
  }

  function renderNodes(nodeTypes: NodeType[]): JSX.Element {
    return (
      <>
        {nodeTypes.map((type, i) =>
          EntityTypeTemplate(
            entityColors[i % entityColors.length],
            type.name,
            'node',
            nodeConditionsRef,
            updateQuery,
            i
          )
        )}
      </>
    );
  }

  function renderEdges(edgeTypes: EdgeType[]): JSX.Element {
    return (
      <>
        {edgeTypes.map((type, i) =>
          EntityTypeTemplate(
            '#a9a9a9',
            type.name,
            'edge',
            edgeConditionsRef,
            updateQuery,
            i
          )
        )}
      </>
    );
  }

  const nodes = fetchDataFromService(
    fetchNodeTypes,
    renderNodes,
    schemaService
  );

  const edges = fetchDataFromService(
    fetchEdgeTypes,
    renderEdges,
    schemaService
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
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            {edges}
          </TabPanel>
        </List>
      </Drawer>
    </div>
  );
};

export default Filter;
