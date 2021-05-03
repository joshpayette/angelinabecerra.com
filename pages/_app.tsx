import * as React from 'react'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import { makeStyles } from '@material-ui/core/styles'
import { theme } from 'theme'
import { SiteNavigation } from 'components/navigation'

const useStyles = makeStyles((theme) => ({
  main: {
    width: '100%',
    height: `calc(100% - ${theme.mixins.toolbar.minHeight}px - 20px)`,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  '@media (orientation: landscape) and (max-height: 500px)': {
    main: {
      width: '100%',
      height: `calc(100% - 75px)`,
    },
  },
  '@global': {
    html: {
      width: '100%',
      height: '100%',
    },
    body: {
      width: '100%',
      height: '100%',
      padding: '0!important',
    },
    '#__next': {
      width: '100%',
      height: '100%',
    },
  },
}))

export default function MyApp({ Component, pageProps }: AppProps) {
  const classes = useStyles()

  // Remove the server-side injected CSS.
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Photographer, Writer, Observer | Angelina Becerra</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta name="pinterest" content="nopin" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SiteNavigation />
        <main className={classes.main}>
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </>
  )
}
