import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  Container,
  Grid,
  Link as MuiLink,
  Typography,
} from '@material-ui/core'
import Image from 'next/image'
import clsx from 'clsx'
import Link from 'next/link'
import { Form, Formik, Field, FormikProps } from 'formik'
import * as Yup from 'yup'
import { TextField } from 'components/TextField'
import ky from 'ky-universal'
import { ContactRequest, ContactResponse } from './api/contact'

const useStyles = makeStyles((theme) => ({
  buttonRow: {
    padding: theme.spacing(2, 0),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    overflowY: 'auto',
  },
  errorText: {
    color: theme.palette.error.main,
    fontStyle: 'italic',
  },
  form: {
    width: '100%',
    maxWidth: 500,
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
    maxHeight: '75vh',
    [theme.breakpoints.up('sm')]: {
      maxHeight: 'initial',
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
  ul: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
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
  successText: {
    fontStyle: 'italic',
  },
  textSection: {
    marginBottom: theme.spacing(4),
  },
}))

interface FormValues {
  email: string
  message: string
}

export default function ContactPage() {
  const classes = useStyles()
  const [formResponse, setFormResponse] = React.useState<ContactResponse>(null)

  return (
    <Container
      disableGutters
      className={clsx(classes.fullHeight, classes.container)}
    >
      <Grid
        container
        justify="flex-start"
        alignItems="flex-start"
        className={classes.fullHeight}
      >
        <Grid item container xs={12} sm={6} className={classes.textWrapper}>
          <Grid item xs={12} className={classes.textSection}>
            <Typography
              variant="h3"
              component="h1"
              color="inherit"
              className={classes.heading}
              gutterBottom
            >
              <strong>Social Media</strong>
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
                <Link
                  href="https://www.instagram.com/angelinaphotography"
                  passHref
                >
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
          </Grid>
          <Grid item container xs={12}>
            <Typography
              variant="h3"
              component="h1"
              color="inherit"
              className={classes.heading}
              gutterBottom
            >
              <strong>Contact Angelina</strong>
            </Typography>
            <Formik
              initialValues={{ email: '', message: '' }}
              onSubmit={async (values, actions) => {
                actions.setSubmitting(true)
                try {
                  const request: ContactRequest = {
                    ...values,
                  }
                  const response: ContactResponse = await ky
                    .post('api/contact', { json: request })
                    .json()
                  setFormResponse(response)
                  if (response.severity === 'success') {
                    actions.resetForm()
                  }
                } catch (e) {
                  setFormResponse({ message: e.message, severity: 'error' })
                }
                actions.setSubmitting(false)
              }}
            >
              {({ isValid, isSubmitting, dirty }: FormikProps<FormValues>) => (
                <Form className={classes.form}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        name="email"
                        label="Your E-Mail"
                        fullWidth
                        required
                        component={TextField}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        name="message"
                        label="Your Message"
                        fullWidth
                        multiline
                        rows={3}
                        required
                        component={TextField}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} className={classes.buttonRow}>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting || !isValid || !dirty}
                    >
                      Submit
                    </Button>
                  </Grid>
                  {formResponse && (
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        component="p"
                        color="inherit"
                        className={clsx(
                          formResponse?.severity === 'error'
                            ? classes.errorText
                            : classes.successText
                        )}
                      >
                        {formResponse.message}
                      </Typography>
                    </Grid>
                  )}
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.imageWrapper}>
          <Image
            src="/angelina-bio.jpg"
            alt="Angelina Becerra Self Photo"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </Grid>
      </Grid>
    </Container>
  )
}
