import React from 'react';
import Modal from '@material-ui/core/Modal';
import {
  Button,
  createStyles,
  Dialog,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { deepPurple, purple } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      color: '#fff',
      backgroundColor: deepPurple[500],
      '&:hover': {
        backgroundColor: purple[500],
      },
    },
    iframe: {
      position: 'fixed',
      right: 0,
      bottom: 0,
      minWidth: '100%',
      minHeight: '100%',
      width: 'auto',
      height: 'auto',
    },
  })
);

function HomeVideoModal(): JSX.Element {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <Dialog maxWidth="xl" open={open} onClose={handleClose}>
      {/* youtube iFrame */}
      <iframe
        className={classes.iframe}
        width="560"
        height="315"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </Dialog>
  );

  return (
    <>
      <Button
        variant="contained"
        className={classes.button}
        onClick={handleOpen}
      >
        Take a tour
      </Button>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </>
  );
}

export default HomeVideoModal;
