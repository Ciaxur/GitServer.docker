import React from 'react';

// Material UI Imports
import {
  Grid, GridSize, makeStyles,
} from '@material-ui/core';

// Component Imports
import RepoItem from './RepoItem';

// Locally Scoped Styles
const useStyles = makeStyles( theme => ({
  
}));


interface Props {
  spacing?: GridSize,   // Default Spacing = 12
}

function RepoList({ spacing }: Props) {
  // Hooks
  const styles = useStyles();

  return (
    <Grid container spacing={10}>
      <Grid item xs={ spacing || 12 }>
        {[
          { name: 'Repo1', description: 'For the win', updatedAt: new Date() },
          { name: 'Repo2', description: 'Yeh', updatedAt: new Date() },
          { name: 'Repo3', description: 'Oh yeh buddy', updatedAt: new Date() },
          { name: 'Repo4', description: 'Mhmm ok', updatedAt: new Date() },
        ].map((elt, index) => (
          <RepoItem 
            key={index} 
            name={elt.name} 
            description={elt.description}
            updatedAt={elt.updatedAt}
            onClick={() => console.log(`${elt.name} Clicked!`)}
          />
        ))
        }
      </Grid>
    </Grid>
  );
}
export default RepoList;