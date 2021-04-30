import * as React from 'react'
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import Link from 'next/link'
import { SiteLinkType } from 'types'

interface Props {
  siteLink: SiteLinkType
}

export const DrawerLink = ({ siteLink }: Props) => {
  const child = (
    <ListItem button component="a">
      {siteLink.icon && <ListItemIcon>{siteLink.icon}</ListItemIcon>}
      <ListItemText>{siteLink.label}</ListItemText>
    </ListItem>
  )
  return siteLink.path ? (
    <Link href={siteLink.path} passHref>
      {child}
    </Link>
  ) : (
    child
  )
}
