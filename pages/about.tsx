import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, Typography } from '@material-ui/core'
import Image from "next/legacy/image"
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: `calc(100% - ${theme.mixins.toolbar.minHeight}px - 30px)`,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  fullHeight: {
    height: '100%',
  },
  heading: {
    fontSize: '2.25rem',
    marginBottom: theme.spacing(4),
  },
  imageWrapper: {
    position: 'relative',
    height: '100%',
    minHeight: 500,
    [theme.breakpoints.up('sm')]: {
      minHeight: 700,
    },
  },
  textWrapper: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4),
    },
  },
  greyText: {
    color: theme.palette.grey[400],
  },
  leadParagraph: {
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
  },
  paragraph: {
    fontSize: '1rem',
    lineHeight: '1.75',
    marginTop: theme.spacing(2),
  },
  copyright: {
    marginTop: theme.spacing(8),
  },
}))

export default function AboutPage() {
  const classes = useStyles()

  return (
    <Container component="main" disableGutters className={classes.container}>
      <Grid
        container
        justify="flex-start"
        alignItems="flex-start"
        className={classes.fullHeight}
      >
        <Grid item xs={12} sm={6} className={classes.imageWrapper}>
          <Image
            src="/angelina-bio.jpg"
            alt="Angelina Becerra Self Photo"
            layout="fill"
            objectFit="cover"
            objectPosition="top center"
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.textWrapper}>
          <Typography
            variant="h3"
            component="h1"
            color="inherit"
            className={classes.heading}
          >
            <strong>About Angelina</strong>
          </Typography>

          <Typography
            variant="body1"
            component="p"
            color="inherit"
            className={clsx(classes.greyText, classes.leadParagraph)}
          >
            Photography has given me a meaning and purpose in life, and enabled
            me to overcome personal setbacks. Like millions of others, I have
            struggled with mental and physical illness (MDD, GAD, and
            fibromyalgia). Photography provides me an outlet to express what I
            cannot through words, and helps me to try to play a part in
            affecting positive change. I focus on emotions, whether it be the
            pain expressed at a political protest, or a tender moment between a
            father and son at a celebratory festival.
          </Typography>
          <Typography
            variant="body1"
            component="p"
            color="inherit"
            className={clsx(classes.greyText, classes.paragraph)}
          >
            My goal is to show the threads of hope, despair, pain, and joy that
            connect everyone, and hopefully evoke awareness and empathy towards
            a person the viewer has never met. While I found photography later
            in my life, I am eager to continue the journey of pursuing my
            passion, and to keep others dealing with mental illness apprised of
            the mistakes, challenges, and accomplishments I learn from along the
            way.
          </Typography>
          <ul>
            <li className={clsx(classes.greyText, classes.paragraph)}>
              Inaugural Recipient of the Lauren Shrensel Zadikow Memorial Award
              SPE
            </li>
            <li className={clsx(classes.greyText, classes.paragraph)}>
              2019 Nikon Storytellers semi-finalist
            </li>
          </ul>
          <Typography
            variant="body2"
            component="p"
            color="inherit"
            className={clsx(classes.greyText, classes.copyright)}
          >
            All images &copy;{new Date().getFullYear()} Angelina Becerra. All
            rights reserved.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  )
}
