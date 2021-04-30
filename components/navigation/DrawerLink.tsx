import * as React from 'react'
import {
  ListItem,
  ListItemIcon,
  Link as MuiLink,
  ListItemText,
} from '@material-ui/core'
import { SiteLinkType } from 'types'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
}))

interface Props {
  siteLink: SiteLinkType
}

export const DrawerLink = ({ siteLink }: Props) => {
  const classes = useStyles()
  const child = (
    <ListItem button>
      {siteLink.icon && <ListItemIcon>{siteLink.icon}</ListItemIcon>}
      <ListItemText>{siteLink.label}</ListItemText>
    </ListItem>
  )
  return siteLink.path ? (
    <MuiLink href={siteLink.path} className={classes.link}>
      {child}
    </MuiLink>
  ) : (
    child
  )
}
