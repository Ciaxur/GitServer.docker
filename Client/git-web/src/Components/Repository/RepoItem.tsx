import React from 'react';
import { IRepository } from '.';

// Style Imports
import { PaperElementPalette } from '../../Styles';

// Material UI Imports
import {
  Paper, Typography,
  Box,
  makeStyles,
} from '@material-ui/core';




// Locally Scoped Styles
const useStyles = makeStyles( theme => ({
  paper: {
    cursor: 'pointer',
    padding: theme.spacing(2),
    textAlign: 'left',
    margin: '15px 0px',

    color: PaperElementPalette.black,
    backgroundColor: PaperElementPalette.white,
    
    '&:hover': {
      backgroundColor: PaperElementPalette.gray,
    },
    '&:active': {
      backgroundColor: PaperElementPalette.darkGray,
    },
    '& *': {
      fontWeight: 'bold',
    },
  },
  leftSection: {
    flexGrow: 1,
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  infoText: {
    color: PaperElementPalette.blueSecondary,
  },
  mute: {
    opacity: 0.75,
  },
}));


interface Props {
  repo:         IRepository,
  onClick?:     (repo: IRepository) => void,
}

function RepoItem({ repo, onClick }: Props) {
  // Hooks
  const styles = useStyles();
  
  return (
    <Paper className={styles.paper} variant='outlined' onClick={() => onClick && onClick(repo)}>
      <Box display='flex' flexDirection='row'>
        <div className={styles.leftSection}>
          <Typography variant='subtitle1'>{repo.title}</Typography>
          <Typography className={styles.infoText} variant='body2'>{repo.description || ''}</Typography>
          <Typography className={`${styles.infoText} ${styles.mute}`} variant='caption'>
            Updated {repo.updatedAt.toLocaleString()}
          </Typography>
        </div>
        <div className={styles.rightSection}>
          {/* Placeholder */}
        </div>
      </Box>
    </Paper>
  );
}
export default RepoItem;