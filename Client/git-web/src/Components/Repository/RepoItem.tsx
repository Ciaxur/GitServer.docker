import React from 'react';

// Style Imports
import { PaperElementPalette } from '../../Styles';

// Material UI Imports
import {
  Paper,
  makeStyles,
  Typography,
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
  infoText: {
    color: PaperElementPalette.blueSecondary,
  },
  mute: {
    opacity: 0.75,
  },
}));


interface Props {
  name:         string,
  description:  string,
  updatedAt:    Date,
  onClick?:     () => void,
}

function RepoItem({ name, description, updatedAt, onClick }: Props) {
  // Hooks
  const styles = useStyles();
  
  return (
    <Paper className={styles.paper} variant='outlined' onClick={onClick}>
      <Typography variant='subtitle1'>{name}</Typography>
      <Typography className={styles.infoText} variant='body2'>{description}</Typography>
      <Typography className={`${styles.infoText} ${styles.mute}`} variant='caption'>
        Updated {updatedAt.toLocaleString()}
      </Typography>
    </Paper>
  );
}
export default RepoItem;