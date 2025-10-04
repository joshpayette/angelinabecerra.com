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
  main: {
    width: '100%',
    height: `calc(100% - ${theme.mixins.toolbar.minHeight}px - 30px)`,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  '@media (orientation: landscape) and (max-height: 500px)': {
    main: {
      width: '100%',
      height: `calc(100% - 75px)`,
    },
  },

  buttonRow: {
    padding: theme.spacing(2, 0),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  copyright: {
    color: theme.palette.grey[400],
    marginTop: theme.spacing(2),
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
    width: '100%',
    height: '100%',
  },
  textWrapper: {
    height: '100%',
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
    fontSize: '1rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.15rem',
    },
  },
  successText: {
    fontStyle: 'italic',
  },
  textSection: {
    marginBottom: theme.spacing(2),
  },
}))

export default function ContactPage() {
  const classes = useStyles()
  const [formResponse, setFormResponse] = React.useState<ContactResponse>(null)
  const textWrapperRef: React.RefObject<HTMLDivElement> = React.useRef()
  const imageWrapperRef: React.RefObject<HTMLDivElement> = React.useRef()

  React.useEffect(() => {
    if (!textWrapperRef.current || !imageWrapperRef.current) {
      return
    }
    imageWrapperRef.current.style.height =
      textWrapperRef.current.offsetHeight + 'px'
  }, [])

  return (
    <Container component="main" className={classes.main}>
      <Grid container justify="flex-start" alignItems="flex-start" spacing={2}>
        <Grid
          item
          container
          xs={12}
          sm={6}
          className={classes.textWrapper}
          ref={textWrapperRef}
        >
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
              initialValues={{
                email: '',
                message: '',
                name: '',
                organization: '',
                phone: '',
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().required('Name is required.'),
                email: Yup.string()
                  .required('Email is required.')
                  .email('Valid email address required.'),
                phone: Yup.string().required('Phone # is required.'),
                message: Yup.string().required('Message is required.'),
              })}
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
              {({
                isValid,
                isSubmitting,
                dirty,
              }: FormikProps<ContactRequest>) => (
                <Form className={classes.form}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        name="name"
                        label="Your Name"
                        fullWidth
                        required
                        component={TextField}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        name="organization"
                        label="Your Company/Organization"
                        fullWidth
                        component={TextField}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        name="email"
                        label="Your E-Mail"
                        type="email"
                        fullWidth
                        required
                        component={TextField}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        name="phone"
                        label="Your Phone #"
                        type="tel"
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
                        rows={5}
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
          <Grid item xs={12}>
            <Typography
              variant="body2"
              component="p"
              color="inherit"
              className={classes.copyright}
              align="left"
            >
              All images &copy;{new Date().getFullYear()} Angelina Becerra. All
              rights reserved.
            </Typography>
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={12}
          sm={6}
          className={classes.imageWrapper}
          ref={imageWrapperRef}
        >
          <Image
            src="/contact.jpg"
            alt="Contact Angelina Becerra"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            unoptimized
          />
        </Grid>
      </Grid>
    </Container>
  )
}
