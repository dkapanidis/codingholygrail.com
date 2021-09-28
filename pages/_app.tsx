import { firebaseConfig } from 'lib/firebase';
import React from 'react';
import { FirebaseAppProvider } from 'reactfire';
import 'styles/globals.css';
import 'styles/prose.css';


type MyAppProps = { Component: any, pageProps: any }

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
      <Component {...pageProps} />
    </FirebaseAppProvider>
  )
}

export default MyApp
