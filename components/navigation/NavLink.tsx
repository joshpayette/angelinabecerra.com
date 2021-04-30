import * as React from 'react'
import { Button, Link as MuiLink, Menu, MenuItem } from '@material-ui/core'
import Link from 'next/link'
import { SiteLinkType } from 'types'

interface Props {
  siteLink: SiteLinkType
}

export const NavLink = ({ siteLink }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return siteLink.path ? (
    <Link href={siteLink.path} passHref>
      <Button component="a" variant="text" color="inherit">
        {siteLink.label}
      </Button>
    </Link>
  ) : (
    <React.Fragment>
      <Menu
        id={`${siteLink.label} Menu`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {siteLink.childLinks.map((childLink) => (
          <MenuItem key={childLink.label} button onClick={handleMenuClose}>
            <Link href={childLink.path}>
              <MuiLink color="inherit">{childLink.label}</MuiLink>
            </Link>
          </MenuItem>
        ))}
      </Menu>
      <Button
        variant="text"
        color="inherit"
        onClick={handleMenuOpen}
        aria-haspopup="true"
        aria-controls={`${siteLink.label} Menu`}
      >
        {siteLink.label}
      </Button>
    </React.Fragment>
  )
}
