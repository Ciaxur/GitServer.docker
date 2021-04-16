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

// Store Imports
import {
  RootStoreContext, RootStoreReducer,
} from './Store/RootStore';

// Component Imports
import HeaderMenu from './Components/HeaderMenu/HeaderMenu';
import MainDrawer from './Components/MainDrawer';

// Route Imports
import Home from './Routes/Home';

const useStyles = makeStyles({
  container: {
    margin: 0,
    padding: 0,
  },
});

function App() {
  // Hooks
  const styles = useStyles();

  // Root Store
  const [rootStore, rootStoreDispatch] = React.useReducer(RootStoreReducer, {
    routePath: '/',
    setRoutePath: () => { return; },
  });
  
  // States
  const [isDrawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  
  // Callbacks
  const onMenuToggle = () => setDrawerOpen(!isDrawerOpen);

  return (
    <RootStoreContext.Provider value={{
      routePath: rootStore.routePath,
      setRoutePath: newRoutePath => rootStoreDispatch({ payload: newRoutePath, type: 'SET_ROUTE' }),
    }} >
      <Router>
        <div className={styles.container}>
          <MainDrawer
            isOpen={isDrawerOpen}
            onMenuToggle={onMenuToggle}
          />
          <HeaderMenu onMenuToggle={onMenuToggle} />

          {/* React Router */}
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='/new-repo'>
              <h1 style={{ textAlign: 'center' }}>New Repo</h1>
            </Route>
          </Switch>

          {/* TODO: Add Footer */}
        </div>
      </Router>
    </RootStoreContext.Provider>
  );
}

export default App;
