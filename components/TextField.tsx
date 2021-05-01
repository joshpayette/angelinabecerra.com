import { FieldProps } from 'formik'
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from '@material-ui/core'
import React from 'react'

type Props = FieldProps &
  MuiTextFieldProps & {
    label: string
  }

export const TextField = ({
  field: { name, value, onChange, onBlur },
  form: { errors, touched },
  fullWidth,
  label,
  ...rest
}: Props): JSX.Element => {
  const errorText = errors[name]
  const hasError = touched[name] && Boolean(errors[name])
  return (
    <MuiTextField
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      label={label}
      error={hasError}
      helperText={hasError ? errorText : ''}
      name={name}
      fullWidth={fullWidth || true}
      color="primary"
      variant="outlined"
      {...rest}
    />
  )
}
