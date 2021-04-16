import React from 'react';
import { useHistory } from 'react-router-dom';
import { RootStoreContext } from '../../Store/RootStore';
import { ColorPalette} from '../../Styles';
import {
  Typography,
  Breadcrumbs, Link,
  makeStyles,
} from '@material-ui/core';;


const useStyles = makeStyles({
  link: {
    cursor: 'pointer',
    color: ColorPalette.whiteFont,
  },
  primaryRoute: {
    color: ColorPalette.bluePrimary,
  },
});


interface Props {
  style?: React.CSSProperties,
}

function SeperatedRoute(props: Props) {
  // Hooks
  const history = useHistory();
  const styles = useStyles();
  const rootStore = React.useContext(RootStoreContext);
  
  const urlPath = React.useMemo(
    () => rootStore.routePath.split('/'),
    [ rootStore.routePath ],
  );

  // Callbacks
  const handleClick = () => { console.log('click'); };

  return (
    <Breadcrumbs separator='›' style={props.style}>
      <Link className={styles.link} color="inherit" onClick={() => {
        rootStore.setRoutePath('/');
        history.push('/');
      }}>
        Home
      </Link>

      {urlPath.slice(1, -1).map((url, index) => (
        <Link className={styles.link} key={index} color="inherit" onClick={handleClick}>
          {url}
        </Link>
      ))}

      <Typography className={styles.primaryRoute} color="textPrimary">{urlPath.slice(-1)}</Typography>
    </Breadcrumbs>
  );
}

export default SeperatedRoute;