import React from 'react';
import {
  AppBar, Toolbar,
  IconButton,
} from '@material-ui/core';
import { MenuOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    backgroundColor: 'red',
    margin: 0,
    padding: 0,
  },
});

function HeaderMenu() {
  // Hooks
  const styles = useStyles();
  
  return (
    <div className={styles.container}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
          >
            <MenuOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
export default HeaderMenu;