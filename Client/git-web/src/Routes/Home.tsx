import React from 'react';

// Style Imports
import { PaperElementPalette } from '../Styles';

// Material UI Components
import {
  Container, Paper, Grid, 
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingTop: 50,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    margin: '15px 0px',
    fontWeight: 'bold',

    color: PaperElementPalette.black,
    backgroundColor: PaperElementPalette.white,
  },
}));

function Home() {
  // Hooks
  const styles = useStyles();

  return (
    <Container className={styles.root}>
      <Grid container spacing={10}>
        <Grid item xs={12}>
          {/* TODO: Have these in a seperate Component */}
          <Paper className={styles.paper} variant='outlined'>
            Repo1
          </Paper>
          <Paper className={styles.paper} variant='outlined'>
            Repo2
          </Paper>
          <Paper className={styles.paper} variant='outlined'>
            Repo3
          </Paper>
          <Paper className={styles.paper} variant='outlined'>
            Repo4
          </Paper>
          <Paper className={styles.paper} variant='outlined'>
            Repo5
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;