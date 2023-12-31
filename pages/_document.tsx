import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/core/styles'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content="#000" />
          <meta
            name="description"
            content="Website for Angelina Becerra, Photographer, Writer, Observer."
          />
          <meta
            property="twitter:card"
            name="twitter:card"
            content="summary_large_image"
          />
          <meta
            property="twitter:site"
            name="twitter:site"
            content="@angelinaphotog"
          />
          <meta
            property="twitter:creator"
            name="twitter:creator"
            content="@angelinaphotog"
          />
          <meta
            property="twitter:title"
            name="twitter:title"
            content="AngelinaBecerra.com"
          />
          <meta
            property="twitter:description"
            name="twitter:description"
            content="Website for Angelina Becerra, Photographer, Writer, Observer."
          />
          <meta
            property="twitter:image"
            name="twitter:image"
            content="https://www.angelinabecerra.com/angelina-og-image.jpg"
          />
          <meta
            property="og:image"
            name="og:image"
            content="https://www.angelinabecerra.com/angelina-og-image.jpg"
          />
          <meta
            property="og:title"
            name="og:title"
            content="AngelinaBecerra.com"
          />
          <meta
            property="og:description"
            name="og:description"
            content="Website for Angelina Becerra, Photographer, Writer, Observer."
          />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          {/* 
            font-family: 'Inter', sans-serif;
            font-family: 'Sacramento', cursive;
          */}
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    })

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  }
}
