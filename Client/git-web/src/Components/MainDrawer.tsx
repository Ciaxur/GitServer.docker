import React from 'react';
import { useHistory } from 'react-router-dom';

import { 
  Drawer, IconButton,
  List, ListItem, ListItemIcon, ListItemText,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  ChevronRightOutlined, ChevronLeftOutlined,
  GitHub,
} from '@material-ui/icons';

const drawerWidth = 240;
const useStyles = makeStyles( theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerTitle: {
    marginRight: 'auto',
    marginLeft: '10px',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}));


interface Props {
  onMenuToggle: () => void,
  isOpen: boolean,
};

function MainDrawer({ onMenuToggle, isOpen }: Props) {
  // Hooks
  const styles = useStyles();
  const history = useHistory();

  // Render
  return (
    <Drawer
      className={styles.drawer}
      variant="persistent"
      anchor="left"
      open={isOpen}
      classes={{
        paper: styles.drawerPaper,
      }}
    >
      <div className={styles.drawerHeader}>
        <Typography 
          className={styles.drawerTitle} 
          variant='subtitle1'
        > Menu </Typography>
        <IconButton onClick={onMenuToggle}>
          { isOpen ? <ChevronLeftOutlined /> : <ChevronRightOutlined /> }
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem button onClick={() => history.push('/new-repo')}>
          <ListItemIcon> <GitHub /> </ListItemIcon>
          <ListItemText primary='Create New Repo' />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon> <GitHub /> </ListItemIcon>
          <ListItemText primary='Item' />
        </ListItem>
      </List>
    </Drawer>
  );
}
export default MainDrawer;