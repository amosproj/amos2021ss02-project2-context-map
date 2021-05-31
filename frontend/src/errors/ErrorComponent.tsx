/* istanbul ignore file */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CancellationError from '../utils/CancellationError';
import { HttpError, NetworkError } from '../services/http';

/**
 * Defines a set of known Errors plus a generic one.
 */
// eslint-disable-next-line no-shadow
export enum ErrorType {
  NotFound = 'NotFoundError',
  Cancellation = 'CancellationError',
  Network = 'NetworkError',
  Generic = 'GenericError',
}

const ErrorComponentData = {
  NotFoundError: {
    imgSrc: '../../errors/notFoundError.png',
    title: 'Page not found',
    text: 'The page you are looking for does not exist.',
  },
  CancellationError: {
    imgSrc: '../../errors/cancellationError.png',
    title: 'Cancellation Error',
    text: 'A cancellation error occurred.',
  },
  NetworkError: {
    imgSrc: '../../errors/networkError.png',
    title: 'Network Error',
    text: 'A network error occurred, please try again.',
  },
  GenericError: {
    imgSrc: '../../errors/genericError.png',
    title: 'Error',
    text: 'Something went wrong.',
  },
};

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '25px',
  },

  img: {
    width: '25%',
  },
});

type ErrorComponentProps = {
  type?: ErrorType;
  jsError?: Error;
};

function ErrorComponent(props: ErrorComponentProps): JSX.Element {
  let { type } = props;
  const { jsError } = props;
  const classes = useStyles();

  // If a JS Error occurred
  if (jsError !== undefined) {
    if (jsError instanceof CancellationError) {
      type = ErrorType.Cancellation;
    } else if (jsError instanceof HttpError && jsError.status === 404) {
      type = ErrorType.NotFound;
    } else if (jsError instanceof NetworkError) {
      type = ErrorType.Network;
    }
  }

  // If no error type specified
  if (type === undefined) type = ErrorType.Generic;

  let { imgSrc, title, text } = ErrorComponentData[type];

  // If jsError, use its error.name and error.message
  if (jsError !== undefined && type === ErrorType.Generic) {
    imgSrc = ErrorComponentData[ErrorType.Generic].imgSrc;
    title = jsError.name;
    text = jsError.message;
  }

  return (
    <Box className={classes.root}>
      <img src={imgSrc} className={classes.img} alt="" />
      <h1>{title}</h1>
      <p>{text}</p>
    </Box>
  );
}

ErrorComponent.defaultProps = {
  type: ErrorType.Generic,
  jsError: undefined,
};

export default ErrorComponent;
