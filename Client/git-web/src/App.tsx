import React from 'react';
import './Styles/App.css';

// Material UI Imports
import {
  makeStyles,
} from '@material-ui/core';

// Component Imports
import HeaderMenu from './Components/HeaderMenu';
import MainDrawer from './Components/MainDrawer';

const useStyles = makeStyles({
  container: {
    margin: 0,
    padding: 0,
  },
});

function App() {
  // Hooks
  const styles = useStyles();

  // States
  const [isDrawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  
  // Callbacks
  const onMenuToggle = () => setDrawerOpen(!isDrawerOpen);
  
  return (
    <div className={ styles.container }>
      <MainDrawer 
        isOpen={isDrawerOpen}
        onMenuToggle={onMenuToggle}
      />
      <HeaderMenu onMenuToggle={onMenuToggle} />
      
      

      
      {/* TODO: Add Drawer (Mini Collapsable Menu) */}
      {/* TODO: Add React Router */}
      {/* TODO: Add Footer */}
    </div>
  );
}

export default App;
