import React from 'react';

// Material UI Components
import {
  Container, makeStyles,
} from '@material-ui/core';

// Compontent Import
import '../Components/Repository/RepoList';
import RepoList from '../Components/Repository/RepoList';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingTop: 50,
  },
}));

function Home() {
  // Hooks
  const styles = useStyles();

  return (
    <Container className={styles.root}>
      <RepoList />
    </Container>
  );
}

export default Home;