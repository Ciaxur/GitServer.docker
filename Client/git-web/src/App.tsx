import React from 'react';
import './Styles/App.css';

// Material UI Imports
import {} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Component Imports
import HeaderMenu from './Components/HeaderMenu';

const useStyles = makeStyles({
  container: {
    backgroundColor: 'red',
    margin: 0,
    padding: 0,
  },
});


function App() {
  // Hooks
  const styles = useStyles();
  
  return (
    <div className={ styles.container }>
      {/* TODO: Add App Bar */}
      <HeaderMenu />

      
      {/* TODO: Add Drawer (Mini Collapsable Menu) */}
      {/* TODO: Add React Router */}
      {/* TODO: Add Footer */}
    </div>
  );
}

export default App;
