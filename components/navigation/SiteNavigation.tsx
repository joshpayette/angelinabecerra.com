import * as React from 'react'
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar,
  Typography,
  Hidden,
} from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'
import { siteLinks } from 'components/navigation/links'
import { makeStyles } from '@material-ui/core/styles'
import { DrawerLink } from './DrawerLink'
import { NavLink } from './NavLink'
import Link from 'next/link'

const useStyles = makeStyles((theme) => ({
  childList: {
    paddingLeft: theme.spacing(4),
  },
  list: {
    width: 250,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  navItems: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  navLinkWrapper: {
    display: 'flex',
  },
  title: {
    fontSize: 36,
    textDecoration: 'none',
    color: '#fff',
    fontFamily: `'Sacramento', cursive`,
    [theme.breakpoints.up('sm')]: {
      fontSize: 48,
    },
  },
}))

export const SiteNavigation = () => {
  const classes = useStyles()
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  return (
    <React.Fragment>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar>
          <Link href="/" passHref>
            <Typography variant="h4" component="a" className={classes.title}>
              Angelina Becerra
            </Typography>
          </Link>
          <div className={classes.navItems}>
            <Hidden mdUp>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Hidden smDown>
              <div className={classes.navLinkWrapper}>
                {siteLinks.map((siteLink) => (
                  <NavLink key={siteLink.label} siteLink={siteLink} />
                ))}
              </div>
            </Hidden>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div
          className={classes.list}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
          onKeyDown={() => setDrawerOpen(false)}
        >
          <List>
            {siteLinks.map((siteLink) => (
              <React.Fragment key={siteLink.label}>
                <DrawerLink siteLink={siteLink} />
                {siteLink.childLinks && (
                  <React.Fragment>
                    <Divider />
                    <List className={classes.childList}>
                      {siteLink.childLinks.map((childLink) => (
                        <DrawerLink
                          siteLink={childLink}
                          key={childLink.label}
                        />
                      ))}
                    </List>
                    <Divider />
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
          </List>
        </div>
      </Drawer>
    </React.Fragment>
  )
}
