import React from 'react';
import { PaperElementPalette } from '../../Styles';
import { IRepository } from '.';

// Material-UI Imports
import {
  makeStyles,
  IconButton,
  Dialog, DialogContent,
  Box,
  Typography,
  DialogActions,
  Button,
} from '@material-ui/core';
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

interface Props {
  isOpen:   boolean,
  repo:     IRepository,
  onClose:  () => void,
}

function RepoInfo(props: Props) {
  // Hooks
  const styles = useStyles();
  
  // Destructure Props
  const { repo } = props;
  
  return (
    <Dialog onClose={props.onClose} open={props.isOpen}>
      <Box className={styles.root}>
        <Box display='flex' alignContent='center'>
          <Typography variant='h6' className={styles.title}>
            {repo.title}
          </Typography>

          <IconButton className={styles.trashBinBtn}>
            <TrashIcon />
          </IconButton>
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

    </Dialog>
  );
}
export default RepoInfo;