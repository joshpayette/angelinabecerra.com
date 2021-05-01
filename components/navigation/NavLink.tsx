import * as React from 'react'
import { Button, Link as MuiLink, Menu, MenuItem } from '@material-ui/core'
import Link from 'next/link'
import { SiteLinkType } from 'types'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  button: {
    padding: 0,
  },
  link: {
    fontSize: '1.2rem',
    fontWeight: 500,
    lineHeight: '1.50rem',
    color: '#fff',
    textTransform: 'none',
    margin: theme.spacing(0, 3),
  },
  popover: {
    marginTop: theme.spacing(6),
  },
}))

interface Props {
  siteLink: SiteLinkType
}

export const NavLink = ({ siteLink }: Props) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return siteLink.path ? (
    <Link href={siteLink.path} passHref>
      <MuiLink className={classes.link}>
        {siteLink.label === 'Home' ? siteLink.icon : siteLink.label}
      </MuiLink>
    </Link>
  ) : (
    <React.Fragment>
      <Menu
        id={`${siteLink.label} Menu`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PopoverClasses={{ paper: classes.popover }}
      >
        {siteLink.childLinks.map((childLink) => (
          <MenuItem button={false} key={childLink.label}>
            <MuiLink
              component="a"
              href={childLink.path}
              color="inherit"
              className={classes.link}
              onClick={handleMenuClose}
              style={{ cursor: 'pointer' }}
            >
              {childLink.label}
            </MuiLink>
          </MenuItem>
        ))}
      </Menu>
      <Button
        variant="text"
        color="inherit"
        onClick={handleMenuOpen}
        aria-haspopup="true"
        aria-controls={`${siteLink.label} Menu`}
        className={clsx(classes.link, classes.button)}
      >
        {siteLink.label}
      </Button>
    </React.Fragment>
  )
}
