import React from 'react';
import { RootStoreContext, RepoActions } from '../../Store/RootStore';
import { PaperElementPalette } from '../../Styles';
import { IRepository } from '.';
import { ConfirmDialog} from '../Utils';

// Material-UI Imports
import {
  makeStyles,
  IconButton,
  Dialog, DialogContent, Box, 
  Typography, DialogActions, 
  Button, Tooltip, Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { 
  DeleteForeverOutlined as TrashIcon,
} from '@material-ui/icons';

// Locally-Scoped Styles
const useStyles = makeStyles(() => ({
  root: {
    minWidth: '45vw',
    minHeight: '15vh',
  },
  trashBinBtn: {
    width: 35,
    height: 35,
    margin: 10,
    
    '&:hover': {
      
      transition: 'color 200ms',
      color: PaperElementPalette.red,
    },
  },
  title: {
    padding: '20px 25px 15px',
    fontWeight: 'bold',
    flexGrow: 1,
  },
  body: {
    opacity: 0.7,
  },
}));


interface InfoActions {
  isConfirmDelete:  boolean,
  errorMessage:     string,
}

interface Props {
  isOpen:   boolean,
  repo:     IRepository,
  onClose:  () => void,
}

function RepoInfo(props: Props) {
  // Hooks
  const styles = useStyles();
  const { dispatch } = React.useContext(RootStoreContext);
  
  // States
  const [infoActions, setInfoActions] = React.useState<InfoActions>({
    isConfirmDelete: false, errorMessage: '',
  });
  
  // Destructure Props
  const { repo } = props;
  
  // Callbacks
  const onSnackbarClose = () => setInfoActions({
    ...infoActions,
    errorMessage: '',
  });
  
  const onCloseConfirm = () => setInfoActions({
    ...infoActions,
    isConfirmDelete: false,
  });
  
  const onDeleteRepo = () => setInfoActions({
    ...infoActions,
    isConfirmDelete: true,
  });

  const onDeleteRepoConfirmed = () => {
    RepoActions.removeRepository(repo.title, dispatch)
      .then(() => {       // Close Everything :)
        onCloseConfirm();
        props.onClose();
      })
      .catch(err => {     // Display Error on Info Dialog
        setInfoActions({
          ...infoActions,
          isConfirmDelete: false,
          errorMessage: err.message,
        });
      });
  };
  
  return (
    <Dialog onClose={props.onClose} open={props.isOpen}>
      <Box className={styles.root}>
        <Box display='flex' alignContent='center'>
          <Typography variant='h6' className={styles.title}>
            {repo.title}
          </Typography>

          <Tooltip title='Delete'>
            <IconButton onClick={onDeleteRepo} className={styles.trashBinBtn}>
              <TrashIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <DialogContent className={styles.body}>
          {repo.description || '(No Description)'}
        </DialogContent>

        <DialogContent className={styles.body}>
          <Typography variant='caption'>
            Created on: {repo.createdAt.toLocaleString()}
            <br />
            Updated on: {repo.updatedAt.toLocaleString()}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={props.onClose}>Close</Button>
        </DialogActions>
      </Box>

      {/* DIALOG: Confirm Repo Deletion */}
      <ConfirmDialog
        title='Delete Repository'
        body='Are you sure you want to delete this repo?'
        isOpen={infoActions.isConfirmDelete}
        onClose={onCloseConfirm}
        onConfirm={onDeleteRepoConfirmed}
      />
      <Snackbar
        open={infoActions.errorMessage.length > 0}
        autoHideDuration={2000}
        onClose={onSnackbarClose}
      >
        <MuiAlert elevation={6} variant='filled' severity='error'>
          {infoActions.errorMessage}
        </MuiAlert>
      </Snackbar>
    </Dialog>
  );
}
export default RepoInfo;