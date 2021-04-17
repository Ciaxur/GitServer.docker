import React from 'react';
import axios from 'axios';

// Material UI Imports
import {
  Grid, GridSize, makeStyles,
} from '@material-ui/core';

// Component Imports
import RepoItem from './RepoItem';
import * as RootStoreActions from '../../Store/RootStore/Actions';
import { RootStoreContext } from '../../Store/RootStore';

// Constant Configurations
const serverIP = process.env.REACT_APP_IP;

// Locally Scoped Styles
const useStyles = makeStyles( () => ({
  
}));



interface Props {
  spacing?: GridSize,   // Default Spacing = 12
}

function RepoList({ spacing }: Props) {
  // Hooks
  const styles = useStyles();
  const { store, dispatch } = React.useContext(RootStoreContext);

  // Repository List State
  const { repoList } = store.repoStore;

  // Fetch Repositories on Start
  React.useEffect(() => {
    axios.get(`${serverIP}/repo`)
      .then(res => res.data)
      .then(data => RootStoreActions.setRepoList(
        data.data
          ? data.data.map((r: string) => (
            { title: r, lastUpdated: new Date() }
          ))
          : [],
        dispatch))
      .catch(err => console.log('Fetch Repositories Error:', err));
  }, []);

  return (
    <Grid container spacing={10}>
      <Grid item xs={ spacing || 12 }>
        {
          repoList.map((elt, index) => (
            <RepoItem
              key={index}
              name={elt.title}
              description={elt.description}
              updatedAt={elt.lastUpdated}
              onClick={() => console.log(`${elt.title} Clicked!`)}
            />
          ))
        }
      </Grid>
    </Grid>
  );
}
export default RepoList;