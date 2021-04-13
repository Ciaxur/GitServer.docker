import React from 'react';
import {
  BrowserRouter as Router,
  Switch, Route,
} from 'react-router-dom';
import './Styles/App.css';

// Material UI Imports
import {
  makeStyles,
} from '@material-ui/core';

// Component Imports
import HeaderMenu from './Components/HeaderMenu/HeaderMenu';
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
    <Router>
      <div className={ styles.container }>
        <MainDrawer 
          isOpen={isDrawerOpen}
          onMenuToggle={onMenuToggle}
        />
        <HeaderMenu onMenuToggle={onMenuToggle} />
        
        {/* React Router */}
        <Switch>
          <Route exact path='/'></Route>
          <Route path='/new-repo'>
            <h1 style={{ textAlign: 'center' }}>New Repo</h1>
          </Route>
        </Switch>
        
        {/* TODO: Add Footer */}
      </div>
    </Router>
  );
}

export default App;
