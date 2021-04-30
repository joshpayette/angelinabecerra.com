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
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing(
      6
    )}px)`,
    overflow: 'hidden',
    paddingTop: theme.spacing(2),
  },
  '@media (orientation: landscape) and (max-height: 500px)': {
    main: {
      height: `calc(100vh - ${
        theme.mixins.toolbar.minHeight
      }px - ${theme.spacing(2)}px)`,
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
