import React from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { ColorPalette } from '../Styles';
import { IRepository } from '../Interfaces/Repository';
import { IRepository as IRepositoryQuery } from '../Components/Repository';
import { RootStoreContext, RepoActions } from '../Store/RootStore';

// Material-UI Imports
import {
  makeStyles,
  Container, Divider, CircularProgress,
  Button, FormHelperText, Typography,
  Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

// Component Imports
import FieldInput from '../Components/Inputs/FieldInput';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 30,
    color: ColorPalette.greyPrimary,
  },
  successText: {
    fontWeight: 'bold',
    color: ColorPalette.greenSuccess,
    textAlign: 'center',
  },
}));

// Constant Configurations
const serverIP = process.env.REACT_APP_IP;


interface InputErrors {
  repoName:               boolean,
  repoNameErrStr:         string,
  repoDescription:        boolean,
  repoDescriptionErrStr:  string,
  overallError:           string,
}
interface SubmitStatus {
  success: boolean,
  loading: boolean,
}

interface RepoModify {
  repo?:          IRepositoryQuery,
  notFound?:      boolean,
  errorMessage?:  string,
}

const inputErrorsDefaults: InputErrors = {
  repoName: false,
  repoDescription: false,
  repoNameErrStr: '',
  repoDescriptionErrStr: '',
  overallError: '',
};
const statusDefaults: SubmitStatus = { success: false, loading: false };


function NewRepo() {
  // Hooks
  const styles = useStyles();
  const history = useHistory();
  const { repoName } = useParams() as any;
  const { store, dispatch } = React.useContext(RootStoreContext);

  // States
  const [inputErrors, setInputErrors] = React.useState<InputErrors>(inputErrorsDefaults);
  const [status, setStatus] = React.useState<SubmitStatus>(statusDefaults);
  const [repoModify, setRepoModify] = React.useState<RepoModify>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  
  // Refs
  const repoNameRef = React.createRef<HTMLInputElement>();
  const repoDescRef = React.createRef<HTMLInputElement>();

  // Effects
  React.useEffect(() => {
    if (repoName) {
      setLoading(true);
      RepoActions.getRepository(repoName)
        .then(repo => {
          // Update the State
          setLoading(false);
          setRepoModify({
            ...repoModify,
            repo,
            notFound: false,
          });

          // Update Input References
          if (repoNameRef.current)
            repoNameRef.current.value = repo.title;
          if (repoDescRef.current)
            repoDescRef.current.value = repo.description || '';
        })
        .catch(err => {
          setLoading(false);
          setRepoModify({
            ...repoModify,
            errorMessage: err.message,
            notFound: true,
          });
        });
    }
  }, [ repoName ]);

  // Methods
  /**
   * Validates input parameters
   * @returns True or false on state of Validity
   */
  const validateInputs = (): boolean => {
    const repoName = repoNameRef.current as HTMLInputElement;
    
    // Assume all is Good
    setInputErrors(inputErrorsDefaults);
    
    // Validate all Inputs
    if (repoName.value.length === 0) {        // No Empty Name
      setInputErrors({
        ...inputErrors,
        repoName: true,
        repoNameErrStr: 'Repository name must not be empty',
      });
      repoName.focus();
      return false;
    }
    else if (repoName.value.match(/\s/)) {    // Repo Name must not have spaces
      setInputErrors({
        ...inputErrors,
        repoName: true,
        repoNameErrStr: 'Name must be alpha-numeric with no spaces',
      });
      repoName.focus();
      return false;
    }

    // Good to go!
    return true;
  };

  /**
   * Submits the creation of the Repository
   */
  const submit = (isEdit?: boolean) => {
    // Reset Status
    setStatus(statusDefaults);
    
    if (validateInputs()) {
      // Start Loading
      setStatus({ ...status, loading: true });
      
      // Issue Request
      const repoRefName = repoNameRef.current;
      const repoRefDesc = repoDescRef.current;

      // Adjust Method based on submission
      const data = {
        title: repoRefName?.value,
        description: repoRefDesc?.value || '',
      } as IRepository;
      
      (
        (isEdit && repoModify.repo)
          ? axios.patch(`${serverIP}/repo/${repoModify.repo.title}`, data)
          : axios.post(`${serverIP}/repo`, data)
      )
        .then(res => res.data)
        .then(async () => {
          if (repoModify.repo) {
            const newRepoData = await RepoActions.getRepository(repoRefName?.value || '');
            RepoActions.updateRepository(repoName, newRepoData, store.repoStore.repoList, dispatch);
          }
          
          setStatus({ ...status, success: true });
          RepoActions.setRoutePath('/', dispatch);
          history.push('/');
        })
        .catch(err => {
          // Set Status State
          setStatus(statusDefaults);
          
          // Extract Data from Error Response
          const status: number = parseInt(err.response.status);

          if (status === 400) {       // Bad Request: Some Request Error done NOT by user
            return setInputErrors({
              ...inputErrors,
              overallError: err.response.data.error || 'Unknown Bad Request Error',
            });
          } 
          else if (status === 409) {  // Conflict: Duplicate Repo!
            repoRefName?.focus();
            return setInputErrors({
              ...inputErrors,
              overallError: 'Repository Name is taken',
            });
          }
          else {
            return setInputErrors({
              ...inputErrors,
              overallError: 'Unknown Internal Error',
            });
          }
        });
    } else {
      setStatus(statusDefaults);
    }
  };

  
  return (
    <Container maxWidth='md' className={styles.root} >
      {
        loading ?
          (<div style={{ textAlign: 'center' }}>
            <CircularProgress style={{ color: ColorPalette.greyPrimary }} />
          </div>)
          :
          (<>
            <FieldInput
              title={repoModify.repo ? `Editing ${repoModify.repo.title}` : 'Create new Repository'}
              titleVariant='h5'
              description={repoModify.repo ? '' : 'Create a new repository internally with the details given'}
              noInput
            />

            <Divider />

            <FieldInput
              title='Repository Name'
              description='Easy but descriptive name to your repository'
              required
              inputRef={repoNameRef}
              style={{ marginTop: 10 }}
              error={inputErrors.repoName}
              errorText={inputErrors.repoNameErrStr}
            />

            <FieldInput
              title='Repository Description'
              description='Optional description about what the repository is about'
              optional
              inputRef={repoDescRef}
              error={inputErrors.repoDescription}
              errorText={inputErrors.repoDescriptionErrStr}
              fullWidth
            />

            <Divider />

            {
              repoModify.repo
                ? <Button style={{ marginTop: 10 }} onClick={() => submit(true)}>Edit Repository</Button>
                : <Button style={{ marginTop: 10 }} onClick={() => submit()}>Create Repository</Button>
            }
            <FormHelperText style={{ textAlign: 'center' }} error>{inputErrors.overallError}</FormHelperText>

            <div className={styles.successText}>
              {status.loading && <CircularProgress style={{ color: ColorPalette.greyPrimary }} />}
              {status.success && <Typography>Repository Successfully Created! 📦</Typography>}
            </div>

            <Snackbar
              open={repoModify.errorMessage !== undefined}
              autoHideDuration={2000}
              onClose={() => setRepoModify({})}
            >
              <MuiAlert elevation={6} variant='filled' severity='error'>
                {repoModify.errorMessage}
              </MuiAlert>
            </Snackbar>
          </>)
      }

    </Container>
  );
}
export default NewRepo;