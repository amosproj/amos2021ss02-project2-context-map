import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  createStyles,
  IconButton,
  List,
  ListItem,
  ListSubheader,
  makeStyles,
  Paper,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { EntityDetailsStateStore } from '../../stores/details/EntityDetailsStateStore';
import useService from '../../dependency-injection/useService';
import useObservable from '../../utils/useObservable';
import { EntityDetailsStore } from '../../stores/details/EntityDetailsStore';
import NodeTypeComponent from '../../search/helper/NodeTypeComponent';
import EdgeTypeComponent from '../../search/helper/EdgeTypeComponent';
import EntityStyleStore from '../../stores/colors/EntityStyleStore';

const useStyles = makeStyles(() =>
  createStyles({
    popper: {
      zIndex: 1201,
      display: 'flex',
      marginLeft: '60px',
      marginTop: '115px',
      minWidth: '250px',
      maxWidth: '400px',
      maxHeight: '80vh',
    },
    propsTable: {
      flexGrow: 1,
      overflow: 'scroll',
    },
    propsCell: {
      maxWidth: '500px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
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
  let title = '';

  if (!details) {
    return <></>;
  }

  if (details.entityType === 'node') {
    title = 'Node Details';
    const { types } = details;
    typesList = types.map((type) => {
      const n = {
        id: -1,
        types: [type],
        virtual: true,
      };
      return (
        <NodeTypeComponent
          name={type}
          color={styleProvider.getStyle(n).color}
        />
      );
    });
  } else {
    title = 'Edge Details';
    const { type } = details;
    const n = {
      id: -1,
      types: [type],
      virtual: true,
    };

    typesList = [
      <EdgeTypeComponent type={type} color={styleProvider.getStyle(n).color} />,
    ];
  }

  const propKeys = Object.keys(details.properties);
  propsList = propKeys.map((propKey) => {
    const propValue = details.properties[propKey];

    return (
      <TableRow>
        <TableCell>{propKey}</TableCell>
        <TableCell className={classes.propsCell}>
          {propValue as string}
        </TableCell>
      </TableRow>
    );
  });

  const propertySection =
    propsList.length > 0 ? (
      <>
        <ListSubheader>Properties</ListSubheader>
        <Table size="small" className={classes.propsTable}>
          <TableBody>{propsList}</TableBody>
        </Table>
      </>
    ) : null;

  return (
    <Popper className={classes.popper} open={open}>
      <Paper>
        <Card raised>
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
            title={title}
          />
          <CardContent>
            <List dense>
              <ListSubheader>ID</ListSubheader>
              <ListItem>
                <h3>{details.id}</h3>
              </ListItem>
              <ListSubheader>Type(s)</ListSubheader>
              <ListItem>{typesList}</ListItem>
              {propertySection}
            </List>
          </CardContent>
        </Card>
      </Paper>
    </Popper>
  );
}
