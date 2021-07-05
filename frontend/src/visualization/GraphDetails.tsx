import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  createStyles,
  IconButton,
  List,
  ListItem,
  makeStyles,
  Paper,
  Popper,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { EntityDetailsStateStore } from '../stores/details/EntityDetailsStateStore';
import useService from '../dependency-injection/useService';
import useObservable from '../utils/useObservable';

const useStyles = makeStyles(() =>
  createStyles({
    popper: {
      zIndex: 1201,
      marginLeft: '60px',
      marginTop: '115px',
      minWidth: '250px',
    },
    closeIcon: {
      float: 'right',
    },
  })
);

export interface ReferenceObject {
  clientHeight: number;
  clientWidth: number;
  referenceNode?: Node;

  getBoundingClientRect(): ClientRect;
}

export default function GraphDetails(): JSX.Element {
  const classes = useStyles();

  const detailsStateStore = useService(EntityDetailsStateStore);
  const detailsState = useObservable(
    detailsStateStore.getState(),
    detailsStateStore.getValue()
  );
  const open = detailsState.node !== null;

  return (
    <Popper className={classes.popper} open={open}>
      <Paper>
        <Card>
          <CardHeader
            action={
              <IconButton
                aria-label="close"
                onClick={() => {
                  detailsStateStore.clear();
                }}
              >
                <CloseIcon />
              </IconButton>
            }
            title="Node Details"
          />
          <CardContent>
            <List>
              <ListItem>Type: X</ListItem>
              <ListItem>Category: Y</ListItem>
              <ListItem>And: More</ListItem>
              <ListItem>Details: edges?</ListItem>
            </List>
          </CardContent>
        </Card>
      </Paper>
    </Popper>
  );
}
