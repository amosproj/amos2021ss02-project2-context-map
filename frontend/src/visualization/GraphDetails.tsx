import React from 'react';
import {
  Button,
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
import { EntityDetailsStore } from '../stores/details/EntityDetailsStore';
import { Node, Edge } from '../shared/entities';
import { EntityStyleStore } from '../stores/colors';
import { QueryNodeResult } from '../shared/queries';

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

export default function GraphDetails(): JSX.Element {
  const classes = useStyles();

  const detailsStateStore = useService(EntityDetailsStateStore);
  const detailsStore = useService(EntityDetailsStore);

  const details = useObservable(
    detailsStore.getState(),
    detailsStore.getValue()
  );

  const entityStyleStore = useService(EntityStyleStore);
  const styleProvider = useObservable(
    entityStyleStore.getState(),
    entityStyleStore.getValue()
  );

  const open = details !== null;
  let typesList: JSX.Element[] = [];
  let propsList: JSX.Element[] = [];

  if (details) {
    const types = Array.isArray((details as unknown as Node)?.types)
      ? (details as unknown as Node).types
      : [(details as unknown as Edge).type];

    typesList = types.map((type) => {
      const { color } = styleProvider.getStyle({
        id: -1,
        types: [type],
        virtual: true,
      } as QueryNodeResult);

      return (
        <Button
          style={{ backgroundColor: color }}
          variant="contained"
          color="primary"
          disabled
        >
          {type}
        </Button>
      );
    });

    const propKeys = Object.keys(details.properties);
    propsList = propKeys.map((propKey) => {
      const propValue = details.properties[propKey];

      return (
        <ListItem>
          {propKey}: {propValue}
        </ListItem>
      );
    });
  }

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
              <ListItem>{typesList}</ListItem>
              {propsList}
            </List>
          </CardContent>
        </Card>
      </Paper>
    </Popper>
  );
}
