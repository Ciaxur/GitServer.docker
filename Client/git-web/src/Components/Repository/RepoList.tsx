import React from 'react';
import axios from 'axios';
import { ColorPalette } from '../../Styles';

// Material UI Imports
import {
  CircularProgress,
  Grid, GridSize, makeStyles, Typography,
} from '@material-ui/core';

// Component Imports
import RepoItem from './RepoItem';
import * as RootStoreActions from '../../Store/RootStore/Actions';
import { RootStoreContext } from '../../Store/RootStore';

// Resource Imports
import SadFace from '../../Resources/Images/sad-64.png';

// Constant Configurations
const serverIP = process.env.REACT_APP_IP;

// Locally Scoped Styles
const useStyles = makeStyles( () => ({
  centerInfo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    
    fontWeight: 'bold',
    color: ColorPalette.greyPrimary,
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  progress: {
    textAlign: 'center',
    color: ColorPalette.greyPrimary,
  },
}));



interface Props {
  spacing?: GridSize,   // Default Spacing = 12
}

function RepoList({ spacing }: Props) {
  // Hooks
  const styles = useStyles();
  const { store, dispatch } = React.useContext(RootStoreContext);

  // Repository List State
  const { repoList, loaded } = store.repoStore;

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
          loaded ? (
            repoList.length ?
              repoList.map((elt, index) => (
                <RepoItem
                  key={index}
                  name={elt.title}
                  description={elt.description}
                  updatedAt={elt.lastUpdated}
                  onClick={() => console.log(`${elt.title} Clicked!`)}
                />
              ))
              :
              <Typography variant='h6' className={styles.centerInfo} >
                <img src={SadFace} width={64} style={{ marginRight: 10 }} />
                No Repositories found...
              </Typography>
          ) : (
            <div className={styles.progressContainer}>
              <CircularProgress className={styles.progress} />
            </div>
          )
        }
      </Grid>
    </Grid>
  );
}
export default RepoList;