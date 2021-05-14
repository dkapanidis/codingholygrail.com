import React from 'react';
import 'styles/globals.css';
import 'styles/prose.css';


type MyAppProps = { Component: any, pageProps: any }

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <Component {...pageProps} />
  )
}

export default MyApp
