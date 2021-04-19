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
  RootStoreDefault, IRootStore,
} from './Store/RootStore';

// Component Imports
import HeaderMenu from './Components/HeaderMenu/HeaderMenu';
import MainDrawer from './Components/MainDrawer';

// Route Imports
import Home from './Routes/Home';
import NewRepo from './Routes/NewRepo';

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
  const [rootStore, rootDispatch] = React.useReducer(RootStoreReducer, RootStoreDefault as IRootStore);

  const contextValue = React.useMemo(() => {
    return { store: { ...rootStore.store }, dispatch: rootDispatch };
  }, [rootStore, rootDispatch]);

  // States
  const [isDrawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  
  // Callbacks
  const onMenuToggle = () => setDrawerOpen(!isDrawerOpen);

  return (
    <RootStoreContext.Provider value={contextValue} >
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
              <NewRepo />
            </Route>
          </Switch>

          {/* TODO: Add Footer */}
        </div>
      </Router>
    </RootStoreContext.Provider>
  );
}

export default App;
