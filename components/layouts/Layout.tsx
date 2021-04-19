import { initGA, logPageView } from '@utils/utils/analytics'
import Head from 'next/head'
import React, { useEffect } from 'react'

type LayoutProps = { children: any, title: string }
export default function Layout({ children, title }: LayoutProps) {
  useEffect(() => {
    initGA()
    logPageView()
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Coding Holy Grail - {title}</title>

        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="google-site-verification" content="" />

        <link rel="icon" href="favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />

        <meta name="apple-mobile-web-app-title" content="Coding Holy Grail" />
        <meta name="application-name" content="Coding Holy Grail" />
        <meta name="theme-color" content="#5f93e7" />

        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />

        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="description" content="Coding Holy Grail - a personal blog about coding and random thoughts." />
        <meta name="keywords" content="" />

        <meta name="twitter:card" content="photo" />
        <meta name="twitter:url" content="https://codingholygrail.com" />
        <meta name="twitter:title" content="Coding Holy Grail" />
        <meta name="twitter:description" content="Coding Holy Grail - a personal blog about coding and random thoughts." />
        <meta name="twitter:site" content="@dkapanidis" />
        <meta name="twitter:creator" content="@dkapanidis" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Coding Holy Grail" />
        <meta property="og:description" content="Coding Holy Grail - a personal blog about coding and random thoughts." />
        <meta property="og:url" content="https://codingholygrail.com" />

        <meta property="fb:admins" content="" />
      </Head>
      <div>
        {children}
      </div>
    </>
  )
}
