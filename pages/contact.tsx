import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, Link as MuiLink, Typography } from '@material-ui/core'
import clsx from 'clsx'
import Link from 'next/link'

const useStyles = makeStyles((theme) => ({
  container: {
    overflowY: 'auto',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  heading: {
    fontSize: '2.25rem',
    marginBottom: theme.spacing(4),
  },
  greyText: {
    color: theme.palette.grey[400],
  },
  ul: {
    listStyle: 'none',
    padding: 0,
  },
  icon: {
    width: 25,
    height: 'auto',
    marginRight: theme.spacing(1),
  },
  muiLink: {
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
    fontSize: '1.15rem',
  },
}))

export default function ContactPage() {
  const classes = useStyles()

  return (
    <Container className={classes.container}>
      <Typography
        variant="h3"
        component="h1"
        color="inherit"
        className={classes.heading}
        gutterBottom
      >
        <strong>Contact Angelina</strong>
      </Typography>
      <ul className={classes.ul}>
        <li className={classes.greyText}>
          <Link href="mailto:info@angelinabecerra.com" passHref>
            <MuiLink className={classes.muiLink}>
              <img
                src="/email-icon.PNG"
                alt="Email Angelina"
                className={classes.icon}
              />
              info@angelinabecerra.com
            </MuiLink>
          </Link>
        </li>
        <li className={classes.greyText}>
          <Link href="https://www.instagram.com/angelinaphotography" passHref>
            <MuiLink className={classes.muiLink}>
              <img
                src="/instagram-icon.png"
                alt="instragram.com/angelinaphotography"
                className={classes.icon}
              />
              instagram.com/angelinaphotography
            </MuiLink>
          </Link>
        </li>
        <li className={classes.greyText}>
          <Link href="https://www.twitter.com/angelinaphotog" passHref>
            <MuiLink className={classes.muiLink}>
              <img
                src="/twitter-icon.PNG"
                alt="twitter.com/angelinaphotog"
                className={classes.icon}
              />
              twitter.com/angelinaphotog
            </MuiLink>
          </Link>
        </li>
      </ul>
    </Container>
  )
}
