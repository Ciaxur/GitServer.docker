import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { ColorPalette } from '../Styles';
import { IRepository } from '../Interfaces/Repository';
// Material-UI Imports
import {
  Container, Divider, CircularProgress,
  makeStyles,
  Button, FormHelperText, Typography,
} from '@material-ui/core';

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

  // States
  const [inputErrors, setInputErrors] = React.useState<InputErrors>(inputErrorsDefaults);
  const [status, setStatus] = React.useState<SubmitStatus>(statusDefaults);
  
  // Refs
  const repoNameRef = React.createRef<HTMLInputElement>();
  const repoDescRef = React.createRef<HTMLInputElement>();

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
  const submit = () => {
    // Reset Status
    setStatus(statusDefaults);
    
    if (validateInputs()) {
      // Start Loading
      setStatus({ ...status, loading: true });
      
      // Issue Request
      const repoName = repoNameRef.current;
      const repoDesc = repoDescRef.current;

      axios.post(`${serverIP}/repo`, {
        title: repoName?.value,
        description: repoDesc?.value || undefined,
      } as IRepository)
        .then(res => res.data)
        .then(() => {
          setStatus({ ...status, success: true });
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
              overallError: 'Unknown Bad Request Error',
            });
          } 
          else if (status === 409) {  // Conflict: Duplicate Repo!
            repoName?.focus();
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
      <FieldInput
        title='Create new Repository'
        titleVariant='h5'
        description='Create a new repository internally with the details given'
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

      <Button style={{ marginTop: 10 }} onClick={() => submit() }>Create Repository</Button>
      <FormHelperText style={{ textAlign: 'center' }} error>{inputErrors.overallError}</FormHelperText>
      
      <div className={styles.successText}>
        { status.loading && <CircularProgress style={{ color: ColorPalette.greyPrimary}} />}
        {status.success && <Typography>Repository Successfully Created! 📦</Typography>}
      </div>
    </Container>
  );
}
export default NewRepo;