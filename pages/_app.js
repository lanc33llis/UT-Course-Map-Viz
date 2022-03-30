import '../styles/globals.sass'
import Head from 'next/head'

import Layout from './components/Layout'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <title>UT Course Map Viz</title>
        <meta name="description" content="Interactive network graph of the University of Texas at Austin's courses for the current semester. Work in progress."/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
