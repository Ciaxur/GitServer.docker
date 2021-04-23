import React from 'react';

// Material-UI Imports
import {
  Button, makeStyles, Typography,
  Dialog, DialogActions, DialogContent,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  title: {
    padding: '20px 25px 15px',
    fontWeight: 'bold',
    flexGrow: 1,
  },
}));


interface Props {
  isOpen:     boolean,
  onClose:    () => void,
  onConfirm:  () => void,
  title:      string,
  body:       string,
}

function ConfirmDialog(props: Props) {
  // Hooks
  const styles = useStyles();
  
  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <Typography variant='h6' className={styles.title}>
        {props.title}
      </Typography>

      <DialogContent>
        {props.body}
      </DialogContent>

      <DialogActions>
        <Button onClick={props.onConfirm}>Yes</Button>
        <Button onClick={props.onClose}>No</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;