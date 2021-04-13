import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Typography,
  Breadcrumbs, Link,
  makeStyles,
} from '@material-ui/core';;


const useStyles = makeStyles({
  link: {
    cursor: 'pointer',
  },
});


interface Props {
  grow?: boolean,
}

function SeperatedRoute(props: Props) {
  // Hooks
  const history = useHistory();
  const styles = useStyles();
  const [isFresh, setFresh] = React.useState<boolean>(false);
  
  const urlPath = React.useMemo(
    () => history.location.pathname.split('/'),
    [ history.location.pathname ],
  );

  // Callbacks
  const handleClick = () => { console.log('click'); };

  return (
    <Breadcrumbs separator='›' style={{ flexGrow: props.grow ? 1 : 'unset' }}>
      <Link className={styles.link} color="inherit" onClick={() => {
        setFresh(!isFresh);
        history.push('/');
      }}>
        Home
      </Link>

      {urlPath.slice(1, -1).map((url, index) => (
        <Link className={styles.link} key={index} color="inherit" onClick={handleClick}>
          {url}
        </Link>
      ))}

      <Typography color="textPrimary">{urlPath.slice(-1)}</Typography>
    </Breadcrumbs>
  );
}

export default SeperatedRoute;