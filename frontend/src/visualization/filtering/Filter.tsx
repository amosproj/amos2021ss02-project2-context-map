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
import React, { useRef } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import useService from '../../dependency-injection/useService';
import { CancellationToken } from '../../utils/CancellationToken';
import { EdgeType, NodeType } from '../../shared/schema';
import EntityFilterElement from './components/EntityFilterElement';
import fetchDataFromService from '../shared-ops/fetchDataFromService';
import entityColors from '../data/GraphData';
import { SchemaService } from '../../services/schema';
import { FilterCondition, MatchAnyCondition } from '../../shared/queries';
import FilterQueryStore from '../../stores/FilterQueryStore';
import MaxEntitiesSlider from './MaxEntitiesSlider';

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

const Filter = (): JSX.Element => {
  // hooks
  const classes = useStyles();
  const [tabIndex, setTabIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const schemaService = useService(SchemaService, null);

  const filterStore = useService(FilterQueryStore);

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
    filterStore.mergeState({ filters });
  }

  // a JSX.Element template used for rendering
  const entityTemplate = (
    color: string,
    name: string,
    entity: 'node' | 'edge',
    i: number
  ) => {
    const setEntryFilterCondition = (
      condition: FilterCondition | null
    ): void => {
      const conditionsRef =
        entity === 'node' ? nodeConditionsRef : edgeConditionsRef;
      const conditions = conditionsRef.current;

      while (conditions.length - 1 < i) {
        conditions.push(null);
      }

      conditions[i] = condition;
      conditionsRef.current = conditions;
      updateQuery();
    };

    return (
      <div>
        <Box display="flex" p={1}>
          <EntityFilterElement
            backgroundColor={color}
            name={name}
            entity={entity}
            setFilterQuery={setEntryFilterCondition}
          />
        </Box>
      </div>
    );
  };

  function renderNodes(nodeTypes: NodeType[]): JSX.Element {
    return (
      <>
        {nodeTypes.map((type, i) =>
          entityTemplate(
            entityColors[i % entityColors.length],
            type.name,
            'node',
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
          entityTemplate('#a9a9a9', type.name, 'edge', i)
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
