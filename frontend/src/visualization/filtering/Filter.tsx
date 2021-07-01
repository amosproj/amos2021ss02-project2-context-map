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
import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import useService from '../../dependency-injection/useService';
import MaxEntitiesSlider from './MaxEntitiesSlider';
import EntityTypeTemplate from './helpers/EntityTypeTemplate';
import useObservable from '../../utils/useObservable';
import SubsidiaryNodesToggle from './SubsidiaryNodesToggle';
import EdgeGreyScaleToggle from './EdgeGreyScaleToggle';
import { EntityStyleStore } from '../../stores/colors';
import ShortestPathMenu from './ShortestPathMenu';
import { QueryEdgeResult, QueryNodeResult } from '../../shared/queries';
import SchemaStore from '../../stores/SchemaStore';
import Reset from './Reset';

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
 * The filtering sidebar component used to update the {@link FilterStateStore}.
 * The filter is divided into node and edge types sections. Each entity section consists of
 * {@link FilterLine}s where the user can further specify which properties the chosen entity
 * shall have. The properties are managed in {@link FilterLineProperties} and a single Property in
 * {@link FilterLineProperty}.
 */
const Filter = (): JSX.Element => {
  // hooks
  const classes = useStyles();
  const [tabIndex, setTabIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const schemaStore = useService(SchemaStore);

  const entityStyleStore = useService(EntityStyleStore);
  const styleProvider = useObservable(
    entityStyleStore.getState(),
    entityStyleStore.getValue()
  );

  const schema = useObservable(schemaStore.getState(), {
    nodeTypes: [],
    edgeTypes: [],
  });

  const nodes = (
    <>
      {schema.nodeTypes.map((type) =>
        EntityTypeTemplate(
          styleProvider.getStyle({
            id: -1,
            types: [type.name],
            virtual: true,
          } as QueryNodeResult).color,
          type.name,
          'node'
        )
      )}
    </>
  );

  const edges = (
    <>
      {schema.edgeTypes.map((type) =>
        EntityTypeTemplate(
          styleProvider.getStyle({
            id: -1,
            type: type.name,
            from: -1,
            to: -1,
            virtual: true,
          } as QueryEdgeResult).color,
          type.name,
          'edge'
        )
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
        <List style={{ overflow: 'auto' }}>
          <TabPanel value={tabIndex} index={0}>
            {nodes}
            <SubsidiaryNodesToggle />
            <div>
              <MaxEntitiesSlider entities="nodes" />
            </div>
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            {edges}
            <MaxEntitiesSlider entities="edges" />
            <EdgeGreyScaleToggle />
          </TabPanel>
          <Divider />
          <ShortestPathMenu />
          <Divider />
          <Reset />
        </List>
      </Drawer>
    </div>
  );
};

export default Filter;
