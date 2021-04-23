import React from 'react';
import { PaperElementPalette } from '../../Styles';

// Material-UI Imports
import {
  Typography, makeStyles,
  TextField, FormHelperText,
} from '@material-ui/core';
import { Variant } from '@material-ui/core/styles/createTypography';



const useStyles = makeStyles(() => ({
  title: {
    fontWeight: 'bold',
  },
  required: {
    color: PaperElementPalette.red,
  },
  optional: {
    opacity: 0.8,
    fontSize: 12,
  },
}));


interface FieldProps {
  title:          string,
  description?:   string,
  required?:      boolean,
  optional?:      boolean,
  titleVariant?:  Variant,
  style?:         React.CSSProperties,

  // Width Properties
  width?:         number,
  fullWidth?:     boolean,

  // Input Props
  noInput?:       boolean,
  inputRef?:      React.Ref<any>,
  error?:         boolean,
  errorText?:     string,
}

function FieldInput(props: FieldProps) {
  // Hooks
  const styles = useStyles();

  return (
    <div style={props.style}>
      <Typography variant={props.titleVariant || 'body1'} className={styles.title}>
        {props.title} {
          props.required ? <span className={styles.required}>*</span>
            : props.optional && <span className={styles.optional}>(Optional)</span>
        }
      </Typography>
      <Typography variant='subtitle1'>
        {props.description}
      </Typography>

      {
        !props.noInput && (<>
          <TextField
            autoFocus
            inputRef={props.inputRef}
            style={{ 
              width: props.fullWidth ? '100%'
                : props.width || 256,
            }}
            variant='outlined'
            size='small'
            error={props.error}
          />
          <FormHelperText error>{(props.error && props.errorText) || ' '}</FormHelperText>
        </>)
      }
    </div>
  );
}
export default FieldInput;