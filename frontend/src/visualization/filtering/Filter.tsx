import { AsyncProps } from 'react-async';
import { AppBar, Box, List, Tab, Tabs, Typography } from '@material-ui/core';
import React from 'react';

import useService from '../../dependency-injection/useService';
import { CancellationToken } from '../../utils/CancellationToken';
import { NodeType } from '../../shared/schema/NodeType';
import { EdgeType } from '../../shared/schema/EdgeType';

import EntityFilterElement from './components/EntityFilterElement';
import fetchDataFromService from '../shared-ops/FetchData';
import entityColors from '../data/GraphData';
import { SchemaService } from '../../services/schema';

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
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
/**
 * A function that wraps the {@link getNodeTypes} call to the schema-service to be usable with react-async.
 * @param props - The props that contains our parameter in an untyped way.
 * @returns A {@link Promise} representing the asynchronous operation. When evaluated, the promise result contains the nodeTypes.
 */
function fetchNodeTypes(props: AsyncProps<NodeType[]>): Promise<NodeType[]> {
  const schemaService = props.service as SchemaService;
  const cancellation = props.cancellation as CancellationToken;
  return schemaService.getNodeTypes(cancellation);
}

/**
 * A function that wraps the {@link getEdgeTypes} call to the schema-service to be usable with react-async.
 * @param props - The props that contains our parameter in an untyped way.
 * @returns A {@link Promise} representing the asynchronous operation. When evaluated, the promise result contains the edgeTypes.
 */
function fetchEdgeTypes(props: AsyncProps<EdgeType[]>): Promise<NodeType[]> {
  const schemaService = props.service as SchemaService;
  const cancellation = props.cancellation as CancellationToken;
  return schemaService.getEdgeTypes(cancellation);
}

const Filter = (): JSX.Element => {
  const [tabIndex, setTabIndex] = React.useState(0);
  const schemaService = useService(SchemaService, null);

  let dataNodeTypes = fetchDataFromService(fetchNodeTypes, schemaService);
  let dataEdgeTypes = fetchDataFromService(fetchEdgeTypes, schemaService);

  // check if data is an JSX.Element -> is still loading or error.
  if (React.isValidElement(dataNodeTypes)) {
    return dataNodeTypes;
  }
  if (React.isValidElement(dataEdgeTypes)) {
    return dataEdgeTypes;
  }

  // collect entityType names and colors.
  dataNodeTypes = dataNodeTypes as NodeType[];
  dataEdgeTypes = dataEdgeTypes as EdgeType[];

  const nodeColorsAndTypes: {
    color: string;
    name: string;
  }[] = [];

  for (let i = 0; i < dataNodeTypes.length; i += 1) {
    nodeColorsAndTypes.push({
      color: entityColors[i % entityColors.length],
      name: dataNodeTypes[i].name,
    });
  }

  const edgeColorsAndTypes: {
    color: string;
    name: string;
  }[] = [];

  for (let i = 0; i < dataEdgeTypes.length; i += 1) {
    edgeColorsAndTypes.push({
      color: '#a9a9a9',
      name: dataEdgeTypes[i].name,
    });
  }

  // a JSX.Element template used for rendering
  const entityTemplate = (
    color: string,
    name: string,
    entity: 'node' | 'edge'
  ) => (
    <div>
      <Box display="flex" p={1}>
        <EntityFilterElement
          backgroundColor={color}
          name={name}
          entity={entity}
        />
      </Box>
    </div>
  );

  // put nodeColorsAndTypes and edgeColorsAndTypes into the entityTemplate
  const nodeTypes: unknown[] = [];
  const edgeTypes: unknown[] = [];

  nodeColorsAndTypes.forEach((colorsAndTypes) => {
    nodeTypes.push(
      entityTemplate(colorsAndTypes.color, colorsAndTypes.name, 'node')
    );
  });

  edgeColorsAndTypes.forEach((colorsAndTypes) => {
    edgeTypes.push(
      entityTemplate(colorsAndTypes.color, colorsAndTypes.name, 'edge')
    );
  });

  const handleChange = (
    event: React.ChangeEvent<Record<string, unknown>>,
    newValue: number
  ) => {
    setTabIndex(newValue);
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Node Types" />
          <Tab label="Edge Types" />
        </Tabs>
      </AppBar>
      <List style={{ maxHeight: '94%', width: 320, overflow: 'auto' }}>
        <TabPanel value={tabIndex} index={0}>
          <div>{nodeTypes}</div>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          {edgeTypes}
        </TabPanel>
      </List>
    </div>
  );
};

export default Filter;
