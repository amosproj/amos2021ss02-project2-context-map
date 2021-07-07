import React from 'react';
import Modal from '@material-ui/core/Modal';
import { Button, createStyles, Dialog, makeStyles } from '@material-ui/core';
import { deepPurple, purple } from '@material-ui/core/colors';

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      color: '#fff',
      backgroundColor: deepPurple[500],
      '&:hover': {
        backgroundColor: purple[500],
      },
    },
    iframe: {
      width: '90vw',
      height: 'calc(50.624vw)', // keeping the video's aspect ratio
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
        src="https://www.youtube.com/embed/14WjlS2P-ZA"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
        style={{ marginBottom: '45px' }}
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
