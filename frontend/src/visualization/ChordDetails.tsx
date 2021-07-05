import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListSubheader,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core';
import useObservable from '../utils/useObservable';
import useService from '../dependency-injection/useService';
import { EntityStyleStore } from '../stores/colors';
import NodeTypeComponent from '../search/helper/NodeTypeComponent';
import ChordDetailsStateStore from '../stores/details/ChordDetailsStateStore';

const useStyles = makeStyles({
  root: {
    maxWidth: '450px',
  },
});

export default function ChordDetails(): JSX.Element {
  const classes = useStyles();

  const entityStyleStore = useService(EntityStyleStore);
  const detailsStateStore = useService(ChordDetailsStateStore);

  const detailsState = useObservable(
    detailsStateStore.getState(),
    detailsStateStore.getValue()
  );

  const styleProvider = useObservable(
    entityStyleStore.getState(),
    entityStyleStore.getValue()
  );

  if (detailsState.index === undefined) {
    return (
      <Card>
        <CardHeader title="Click a node type to display its details" />
      </Card>
    );
  }
  const { index, chordData } = detailsState;
  const { matrix, names } = chordData;
  const type = chordData.names[index];

  // needed to get the style from the EntityStyleStore
  const fakeNode = { id: -1, types: [type], virtual: true };

  return (
    <Card raised className={classes.root}>
      <CardHeader title="Details" />
      <CardContent>
        <List dense>
          <ListSubheader>Node Type</ListSubheader>
          <ListItem>
            {' '}
            <NodeTypeComponent
              name={type}
              color={styleProvider.getStyle(fakeNode).color}
            />
          </ListItem>
          <ListSubheader>Edges</ListSubheader>
          <Table size="small">
            <TableBody>
              {matrix[index].map((noEdges, i) => (
                <TableRow>
                  <TableCell>{names[i]}</TableCell>
                  <TableCell align="right">{noEdges}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </List>
      </CardContent>
    </Card>
  );
}
