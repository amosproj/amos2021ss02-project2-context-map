import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

/**
 * Defines a set of known Errors plus a generic one.
 */
// eslint-disable-next-line no-shadow
export enum ErrorType {
  NotFoundError = 'NotFoundError',
  CancellationError = 'CancellationError',
  NetworkError = 'NetworkError',
  GenericError = 'GenericError',
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
    text: 'A cancellation error occured.',
  },
  NetworkError: {
    imgSrc: '../../errors/networkError.png',
    title: 'Network Error',
    text: 'A network error occured, please try again.',
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
    const { imgSrc } = ErrorComponentData[ErrorType.GenericError];
    return (
      <Box className={classes.root}>
        <img src={imgSrc} className={classes.img} alt="" />
        <h1>{jsError.name}</h1>
        <p>{jsError.message}</p>
      </Box>
    );
  }

  // If no error type specified
  if (type === undefined) type = ErrorType.GenericError;
  const { imgSrc, title, text } = ErrorComponentData[type];
  return (
    <Box className={classes.root}>
      <img src={imgSrc} className={classes.img} alt="" />
      <h1>{title}</h1>
      <p>{text}</p>
    </Box>
  );
}

ErrorComponent.defaultProps = {
  type: ErrorType.GenericError,
  jsError: undefined,
};

export default ErrorComponent;
