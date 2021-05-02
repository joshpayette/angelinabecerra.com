import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  DialogTitleProps,
  DialogTitle as MuiDialogTitle,
  Typography,
  IconButton,
} from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  dialogCloseButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  dialogRoot: {
    margin: 0,
    padding: theme.spacing(2),
  },
}))

export const DialogTitle = (props: DialogTitleProps & { onClose(): void }) => {
  const classes = useStyles()
  const { children, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.dialogRoot} {...other}>
      <Typography variant="body1" component="div">
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.dialogCloseButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
}
