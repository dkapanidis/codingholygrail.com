---
title: 'Refactoring landing page with React, NextJS & TailwindCSS'
excerpt: 'In this blog post I describe the refactoring process that took place in our product landing page Kubernetic, in order to get a more clean UI. The whole process took 5 days and was a complete rewrite of the landing page, including the trial signup form and stripe integration for payments.'
coverImage: '/posts/12-awesome-cli-tools/banner.png'
date: '2020-10-09T11:15:03.123Z'
author:
  name: Dimitris Kapanidis
  picture: '/images/dkapanidis.jpg'
ogImage:
  url: '/posts/12-awesome-cli-tools/banner.png'
slug: 'refactoring-landing-page-with-react-nextjs-tailwind'
topic: 'react'
---

![Banner](/posts/refactoring-landing-page-with-react-nextjs-tailwind/banner.png)

In this blog post I describe the refactoring process that took place in my product landing page [Kubernetic](https://kubernetic.com/), in order to get a more clean UI. The whole process took 5 days and was a complete rewrite of the landing page, including the trial signup form and stripe integration for payments.

The main reason of the refactor was to test out TailwindCSS framework and their utility-first design. I'm not sure if they coined the term but that was the first time I encountered it and wanted to try it out and see the benefits / inconveniences in a real-world use case.  The landing page desperately needed a lift-up and it's a small project that fitted the description.

You can check the code of the landing page at [https://github.com/harbur/www.kubernetic.com](https://github.com/harbur/www.kubernetic.com).

## NextJS Starter

Since we do a fresh start with the landing page, it was time to use [NextJS](https://nextjs.org/) instead of [Create React App](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) (CRA).

In React website there is a [recommended toolchains](https://reactjs.org/docs/create-a-new-react-app.html#recommended-toolchains) section where they describe CRA as best fit if you're learning React or building a single-page app, while NextJS is best fit for server-rendered website with NodeJS.

Probably this landing page would fit in the CRA definition since we don't use NodeJS for server-side, but still I found myself more comfortable with NextJS guiding me with an opinionated way to build stuff (e.g. pages structure), and the integration during deployment to production or with TailWindCSS which we'll discuss further below.

For NextJS there is a quick starter template you can use to bootstrap your repo:

```sh
$ npx create-next-app nextjs-blog --use-npm --example \
https://github.com/vercel/next-learn-starter/tree/master/learn-starter
```

Once you have the repository you can run the app using npm run dev and open the http://localhost:3000.

![WelcomeNext](/posts/refactoring-landing-page-with-react-nextjs-tailwind/welcome-next.png "NextJS starter repo")

## NextJS + TailwindCSS Starter

TailwindCSS is essentially a PostCSS plugin, so in order to integrate it you need to install [PostCSS](https://postcss.org/) first, a tool for transforming CSS with JavaScript. There is a great guide for integrating NextJS with TailwindCSS [here](https://medium.com/better-programming/how-to-set-up-next-js-with-tailwind-css-b93ccd2d4164) which I definitely would recommend to read and do the exercise yourself so that you can better understand the concepts and mechanisms behind the curtain. For faster bootstrapping though you can use the following starter instead that already comes prepared:

```sh
$ npx create-next-app nextjs-blog --use-npm --example \
https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss
```

Now run `npm run dev` and open http://localhost:3000 on your browser:


![NextTailwind](/posts/refactoring-landing-page-with-react-nextjs-tailwind/next-tailwind.png)

## Enable TypeScript

There are always strong opinions between javascript vs typescript, choose the one you're more comfortable with, I personally prefer typescript from javascript because it is a strongly typed superset, which can provide a compilation-time validation of the types, and the IDE (my current favourite is [Visual Studio Code](https://code.visualstudio.com/)) is providing helpful insight  when I'm coding.

In case you want to enable typescript, NextJS provide a [nice onboarding process](https://nextjs.org/docs/basic-features/typescript). First, create an empty `tsconfig.json` file in the root of your project:

```sh
touch tsconfig.json
```

Once created run `npm run dev` and follow the instructions to install the dependencies:

```sh
npm run dev

# You'll see instructions like these:
#
# Please install typescript, @types/react, and @types/node by running:
#
#         yarn add --dev typescript @types/react @types/node
#
# ...
```

Once the dependencies are installed, on the next run the following configuration files are auto-generated for you `tsconfig.json`, `next-env.d.ts`. Now you can start converting `.js` files to `.tsx` use typescript in the project.

## Pages Structure

One of the things I really liked on NextJS is the predefined [Pages layout](https://nextjs.org/docs/basic-features/pages).

In a nutshell if you create for example `pages/about.tsx` that exports a React component, it will be accessible at `/about`.

It also supports pages with dynamic routes. For example, if you create a file called `pages/posts/[id].tsx`, then it will be accessible at `posts/1`, `posts/2`, etc.

In the landing repo the pages structure is the following:

* `index.tsx` - The landing page.
* `enterprise/trial.tsx` - Signup form for trial of Kubernetic Enterprise, sent to [Netlify Forms](https://docs.netlify.com/forms/setup/).
* `payment/checkout.tsx` - Form for payment of Kubernetic Desktop, sent to [Stripe](http://stripe.com/).
* `payment/success.tsx` - The redirect page from successful Stripe payments.

## tsconfig.json

I'm not very fan of fiddling with the `tsconfig.json` as I like to keep it as lean as possible, but there is one change I like, adding `baseURL` and the corresponding `paths` ([tsconfig reference](https://www.typescriptlang.org/tsconfig#baseUrl)):

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@components/*": ["components/*"],
      "@utils/*": ["utils/*"],
      "@styles/*": ["styles/*"]
    },
    ...
  }
}
```

Now your imports are relative to the root directory instead of being relative to current directory. So the `index.tsx` file can now be updated to the following:

```tsx
# OLD import without defined baseUrl:
# import Nav from '../components/nav'

# NEW import with defined baseUrl:
import Nav from '@components/nav'


export default function IndexPage() {
  return (
    <div>
      <Nav />
      <div className="py-20">
        <h1 className="text-5xl text-center text-accent-1">
          Next.js + Tailwind CSS
        </h1>
      </div>
    </div>
  )
}
```

If you get tired of imports always looking like "../" or "./". Or needing to change as you move files, this is a great way to fix that.

## Call-To-Action Button (CTA)

The CTA button has a principal download link with a nice-looking dropdown menu that displays option for different OS. I've added a slight shadow on hover and a transition movement of 1-px in 0.3secs which gives the illusion of button popup.

![Call To Action](/posts/refactoring-landing-page-with-react-nextjs-tailwind/cta.gif)

All this is very easy to do with TailWindCSS and it gave me a pixel perfect freedom that I didn't feel before. This is exactly what I was looking for with the utility-first design without entering the here-be-dragons CSS world. Arguably, you could still say it's CSS, but I'd say it's a bit more abstract, and it sits somewhere between CSS and pre-cooked UI frameworks such as Bootstrap or Material UI.

The actual CTAButton can be found [here](https://github.com/harbur/www.kubernetic.com/blob/5a3b194720a71553cd4eae2452681f96f8530c48/components/CTAButton.tsx). First create the SVG icons of the CTA button as a separate component components/Icons.tsx:

```tsx
export function AppleIcon() {
  return (<svg className="fill-current place-self-center align-middle w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 315" version="1.1" >
    <g>
      <path d="M213.803394,167.030943 C214.2452,214.609646 255.542482,230.442639 256,230.644727 C255.650812,231.761357 249.401383,253.208293 234.24263,275.361446 C221.138555,294.513969 207.538253,313.596333 186.113759,313.991545 C165.062051,314.379442 158.292752,301.507828 134.22469,301.507828 C110.163898,301.507828 102.642899,313.596301 82.7151126,314.379442 C62.0350407,315.16201 46.2873831,293.668525 33.0744079,274.586162 C6.07529317,235.552544 -14.5576169,164.286328 13.147166,116.18047 C26.9103111,92.2909053 51.5060917,77.1630356 78.2026125,76.7751096 C98.5099145,76.3877456 117.677594,90.4371851 130.091705,90.4371851 C142.497945,90.4371851 165.790755,73.5415029 190.277627,76.0228474 C200.528668,76.4495055 229.303509,80.1636878 247.780625,107.209389 C246.291825,108.132333 213.44635,127.253405 213.803394,167.030988 M174.239142,50.1987033 C185.218331,36.9088319 192.607958,18.4081019 190.591988,0 C174.766312,0.636050225 155.629514,10.5457909 144.278109,23.8283506 C134.10507,35.5906758 125.195775,54.4170275 127.599657,72.4607932 C145.239231,73.8255433 163.259413,63.4970262 174.239142,50.1987249"></path>
    </g>
  </svg>
  )
}

export function DropdownIcon() {
  return (<svg className="fill-current -mr-1 -ml-1 h-5 w-5 rounded-md" viewBox="0 0 20 20">
    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
  </svg>
  )
}

export function WinIcon() {
  return (
    <svg className="fill-current w-4 mr-2" xmlns="http://www.w3.org/2000/svg" version="1.1"
      viewBox="-2.61977004 -2.61977004 92.56520808 92.83416708">
      <path
        d="M 0,12.40183 35.68737,7.5416 35.70297,41.96435 0.03321,42.16748 z m 35.67037,33.52906 0.0277,34.45332 -35.66989,-4.9041 -0.002,-29.77972 z M 39.99644,6.90595 87.31462,0 l 0,41.527 -47.31818,0.37565 z M 87.32567,46.25471 87.31457,87.59463 39.9964,80.91625 39.9301,46.17767 z" />
    </svg>
  )
}

export function LinuxIcon() {
  return (
    <svg className="fill-current w-4 mr-2" xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 266 312">
      <g transform="translate(-3.3359375,285.2793)">
        <path d="M132-206c0,1-1,1-1,1h-1c-1,0-1-1-2-2,0,0-1-1-1-2s0-1,1-1l2,1c1,1,2,2,2,3m-18-10c0-5-2-8-5-8,0,0,0,1-1,1v2h3c0,2,1,3,1,5h2m35-5c2,0,3,2,4,5h2c-1-1-1-2-1-3s0-2-1-3-2-2-3-2c0,0-1,1-2,1,0,1,1,1,1,2m-30,16c-1,0-1,0-1-1s0-2,1-3c2,0,3-1,3-1,1,0,1,1,1,1,0,1-1,2-3,4h-1m-11-1c-4-2-5-5-5-10,0-3,0-5,2-7,1-2,3-3,5-3s3,1,5,3c1,3,2,6,2,9v1,1h1v-1c1,0,1-2,1-6,0-3,0-6-2-9s-4-5-8-5c-3,0-6,2-7,5-2,4-2.4,7-2.4,12,0,4,1.4,8,5.4,12,1-1,2-1,3-2m125,141c1,0,1-0.4,1-1.3,0-2.2-1-4.8-4-7.7-3-3-8-4.9-14-5.7-1-0.1-2-0.1-2-0.1-1-0.2-1-0.2-2-0.2-1-0.1-3-0.3-4-0.5,3-9.3,4-17.5,4-24.7,0-10-2-17-6-23s-8-9-13-10c-1,1-1,1-1,2,5,2,10,6,13,12,3,7,4,13,4,20,0,5.6-1,13.9-5,24.5-4,1.6-8,5.3-11,11.1,0,0.9,0,1.4,1,1.4,0,0,1-0.9,2-2.6,2-1.7,3-3.4,5-5.1,3-1.7,5-2.6,8-2.6,5,0,10,0.7,13,2.1,4,1.3,6,2.7,7,4.3,1,1.5,2,2.9,3,4.2,0,1.3,1,1.9,1,1.9m-92-145c-1-1-1-3-1-5,0-4,0-6,2-9,2-2,4-3,6-3,3,0,5,2,7,4,1,3,2,5,2,8,0,5-2,8-6,9,0,0,1,1,2,1,2,0,3,1,5,2,1-6,2-10,2-15,0-6-1-10-3-13-3-3-6-4-10-4-3,0-6,1-9,3-2,3-3,5-3,8,0,5,1,9,3,13,1,0,2,1,3,1m12,16c-13,9-23,13-31,13-7,0-14-3-20-8,1,2,2,4,3,5l6,6c4,4,9,6,14,6,7,0,15-4,25-11l9-6c2-2,4-4,4-7,0-1,0-2-1-2-1-2-6-5-16-8-9-4-16-6-20-6-3,0-8,2-15,6-6,4-10,8-10,12,0,0,1,1,2,3,6,5,12,8,18,8,8,0,18-4,31-14v2c1,0,1,1,1,1m23,202c4,7.52,11,11.3,19,11.3,2,0,4-0.3,6-0.9,2-0.4,4-1.1,5-1.9,1-0.7,2-1.4,3-2.2,2-0.7,2-1.2,3-1.7l17-14.7c4-3.19,8-5.98,13-8.4,4-2.4,8-4,10-4.9,3-0.8,5-2,7-3.6,1-1.5,2-3.4,2-5.8,0-2.9-2-5.1-4-6.7s-4-2.7-6-3.4-4-2.3-7-5c-2-2.6-4-6.2-5-10.9l-1-5.8c-1-2.7-1-4.7-2-5.8,0-0.3,0-0.4-1-0.4s-3,0.9-4,2.6c-2,1.7-4,3.6-6,5.6-1,2-4,3.8-6,5.5-3,1.7-6,2.6-8,2.6-8,0-12-2.2-15-6.5-2-3.2-3-6.9-4-11.1-2-1.7-3-2.6-5-2.6-5,0-7,5.2-7,15.7v3.3,11.6,8.9,4.3,3c0,0.9-1,2.9-1,6-1,3.1-1,6.62-1,10.6l-2,11.1v0.17m-145-5.29c9.3,1.36,20,4.27,32.1,8.71,12.1,4.4,19.5,6.7,22.2,6.7,7,0,12.8-3.1,17.6-9.09,1-1.94,1-4.22,1-6.84,0-9.45-5.7-21.4-17.1-35.9l-6.8-9.1c-1.4-1.9-3.1-4.8-5.3-8.7-2.1-3.9-4-6.9-5.5-9-1.3-2.3-3.4-4.6-6.1-6.9-2.6-2.3-5.6-3.8-8.9-4.6-4.2,0.8-7.1,2.2-8.5,4.1s-2.2,4-2.4,6.2c-0.3,2.1-0.9,3.5-1.9,4.2-1,0.6-2.7,1.1-5,1.6-0.5,0-1.4,0-2.7,0.1h-2.7c-5.3,0-8.9,0.6-10.8,1.6-2.5,2.9-3.8,6.2-3.8,9.7,0,1.6,0.4,4.3,1.2,8.1,0.8,3.7,1.2,6.7,1.2,8.8,0,4.1-1.2,8.2-3.7,12.3-2.5,4.3-3.8,7.5-3.8,9.78,1,3.88,7.6,6.61,19.7,8.21m33.3-90.9c0-6.9,1.8-14.5,5.5-23.5,3.6-9,7.2-15,10.7-19-0.2-1-0.7-1-1.5-1l-1-1c-2.9,3-6.4,10-10.6,20-4.2,9-6.4,17.3-6.4,23.4,0,4.5,1.1,8.4,3.1,11.8,2.2,3.3,7.5,8.1,15.9,14.2l10.6,6.9c11.3,9.8,17.3,16.6,17.3,20.6,0,2.1-1,4.2-4,6.5-2,2.4-4.7,3.6-7,3.6-0.2,0-0.3,0.2-0.3,0.7,0,0.1,1,2.1,3.1,6,4.2,5.7,13.2,8.5,25.2,8.5,22,0,39-9,52-27,0-5,0-8.1-1-9.4v-3.7c0-6.5,1-11.4,3-14.6s4-4.7,7-4.7c2,0,4,0.7,6,2.2,1-7.7,1-14.4,1-20.4,0-9.1,0-16.6-2-23.6-1-6-3-11-5-15-2-3-4-6-6-9s-3-6-5-9c-1-4-2-7-2-12-3-5-5-10-8-15-2-5-4-10-6-14l-9,7c-10,7-18,10-25,10-6,0-11-1-14-5l-6-5c0,3-1,7-3,11l-6.3,12c-2.8,7-4.3,11-4.6,14-0.4,2-0.7,4-0.9,4l-7.5,15c-8.1,15-12.2,28.9-12.2,40.4,0,2.3,0.2,4.7,0.6,7.1-4.5-3.1-6.7-7.4-6.7-13m71.6,94.6c-13,0-23,1.76-30,5.25v-0.3c-5,6-10.6,9.1-18.4,9.1-4.9,0-12.6-1.9-23-5.7-10.5-3.6-19.8-6.36-27.9-8.18-0.8-0.23-2.6-0.57-5.5-1.03-2.8-0.45-5.4-0.91-7.7-1.37-2.1-0.45-4.5-1.13-7.1-2.05-2.5-0.79-4.5-1.82-6-3.07-1.38-1.26-2.06-2.68-2.06-4.27,0-1.6,0.34-3.31,1.02-5.13,0.64-1.1,1.34-2.2,2.04-3.2,0.7-1.1,1.3-2.1,1.7-3.1,0.6-0.9,1-1.8,1.4-2.8,0.4-0.9,0.8-1.8,1-2.9,0.2-1,0.4-2,0.4-3s-0.4-4-1.2-9.3c-0.8-5.2-1.2-8.5-1.2-9.9,0-4.4,1-7.9,3.2-10.4s4.3-3.8,6.5-3.8h11.5c0.9,0,2.3-0.5,4.4-1.7,0.7-1.6,1.3-2.9,1.7-4.1,0.5-1.2,0.7-2.1,0.9-2.5,0.2-0.6,0.4-1.2,0.6-1.7,0.4-0.7,0.9-1.5,1.6-2.3-0.8-1-1.2-2.3-1.2-3.9,0-1.1,0-2.1,0.2-2.7,0-3.6,1.7-8.7,5.3-15.4l3.5-6.3c2.9-5.4,5.1-9.4,6.7-13.4,1.7-4,3.5-10,5.5-18,1.6-7,5.4-14,11.4-21l7.5-9c5.2-6,8.6-11,10.5-15s2.9-9,2.9-13c0-2-0.5-8-1.6-18-1-10-1.5-20-1.5-29,0-7,0.6-12,1.9-17s3.6-10,7-14c3-4,7-8,13-10s13-3,21-3c3,0,6,0,9,1,3,0,7,1,12,3,4,2,8,4,11,7,4,3,7,8,10,13,2,6,4,12,5,20,1,5,1,10,2,17,0,6,1,10,1,13,1,3,1,7,2,12,1,4,2,8,4,11,2,4,4,8,7,12,3,5,7,10,11,16,9,10,16,21,20,32,5,10,8,23,8,36.9,0,6.9-1,13.6-3,20.1,2,0,3,0.8,4,2.2s2,4.4,3,9.1l1,7.4c1,2.2,2,4.3,5,6.1,2,1.8,4,3.3,7,4.5,2,1,5,2.4,7,4.2,2,2,3,4.1,3,6.3,0,3.4-1,5.9-3,7.7-2,2-4,3.4-7,4.3-2,1-6,3-12,5.82-5,2.96-10,6.55-15,10.8l-10,8.51c-4,3.9-8,6.7-11,8.4-3,1.8-7,2.7-11,2.7l-7-0.8c-8-2.1-13-6.1-16-12.2-16-1.94-29-2.9-37-2.9" />
      </g>
    </svg >
  )
}
```

Once the Icons are created you can create the CTA button `components/CTAButton.tsx`:

```tsx
import { useState } from "react"
import { OutboundLink } from "react-ga"
import { AppleIcon, DropdownIcon, LinuxIcon, WinIcon } from "./Icons"

export default function CTAButton() {
  const [isOpen, updateIsOpen] = useState(false)
  return (
    <>
      <div className="inline-flex">
        <div className="relative">
          <div className="btn-popup inline-flex w-56 divide-x divide-green-600 hover:shadow-lg">
            <OutboundLink
              eventLabel="download mac"
              to="https://kubernetic.s3.amazonaws.com/Kubernetic-2.13.0.dmg">
              <button className="btn btn-green inline-flex w-48 rounded-l  px-3 py-3 pl-4">
                <AppleIcon />
                <span>Download for Mac</span>
              </button>
            </OutboundLink>
            <button aria-label="choose-os" className="btn btn-green inline-flex transition rounded-r ease-in-out duration-150 px-3 py-3"
              onClick={() => updateIsOpen(!isOpen)}>
              <DropdownIcon />
            </button>
          </div>
          {isOpen && <DropdownMenu />}
        </div>
      </div>
    </>
  )
}


const DropdownMenu = () => (
  <div className="absolute">
    <ul className="w-56 ml-1 p-2 mt-2 text-gray-600 bg-white border border-gray-100 rounded-lg shadow-md min-w-max-content right-0" aria-label="submenu">
      <DropdownMenuItem icon={<WinIcon />} text="Download for Windows" eventLabel="download win" to="https://www.kubernetic.com/images/kubernetic.webp" />
      <DropdownMenuItem icon={<LinuxIcon />} text="Download for Linux" eventLabel="download linux" to="https://www.kubernetic.com/images/kubernetic.webp" />
    </ul>
  </div>
)

type DropdownMenuProps = { icon: any, text: string, eventLabel: string, to: string }
function DropdownMenuItem({ icon, text, eventLabel, to }: DropdownMenuProps) {
  return (
    <OutboundLink
      eventLabel={eventLabel}
      to={to}
    >
      <li>
        <a className="inline-flex items-center cursor-pointer w-full px-2 py-2 text-sm font-medium transition-colors duration-150 rounded-md hover:bg-gray-200 hover:text-gray-800" type="button">
          {icon}
          <span>{text}</span>
        </a>
      </li>
    </OutboundLink>
  )
}
```

Lastly, in order to be able to re-use the styling of the buttons elsewhere I've defined it in the `index.css` instead of inlining it on each component:

```css
@tailwind base;

/* Write your own custom base styles here */

/* Start purging... */
@tailwind components;
/* Stop purging. */

/* Write your own custom component styles here */
.btn-blue {
  @apply bg-blue-500 text-white font-bold py-2 px-4 rounded;
}

/* Start purging... */
@tailwind utilities;
/* Stop purging. */

/* Your own custom utilities */

/* Button */
.btn {
  @apply whitespace-no-wrap text-base font-medium items-center justify-center cursor-pointer;
}
.btn:focus {
  @apply outline-none shadow-outline;
}
.btn:hover {
  @apply shadow-lg;
}

/* Button Popup */
.btn-popup {
  @apply transition duration-300 ease-in-out transform;
}
.btn-popup:hover {
  @apply -translate-y-px;
}

/* Button Green */
.btn-green {
  @apply text-white bg-green-500;
}
.btn-green:focus {
  @apply border-green-700;
}
.btn-green:hover {
  @apply text-white bg-green-400;
}
.btn-green:active {
  @apply bg-green-700;
}
```

Update your `pages/ndex.tsx` to include the CTAButton:

```tsx
import CTAButton from '@components/CTAButton'
import Nav from '@components/nav'

export default function IndexPage() {
  return (
    <div>
      <Nav />
      <div className="py-20">
        <h1 className="text-center">
          <CTAButton/>
        </h1>
      </div>
    </div>
  )
}
```

You should now be able to see your own CTA Button:


![CTA Dropdown](/posts/refactoring-landing-page-with-react-nextjs-tailwind/cta-dropdown.png "CTA Button")

## Deploy with Netlify

Previously our landing page was deployed on Google Storage Bucket which was served by Google Cloud CDN. The deployment was done manually, now we use Netlify and can't look back anymore. Here are some features that we currently use:

* Pushes on `master` repository are automatically published on website.
* Automatic HTTPS certificates with [Let's Encrypt](https://letsencrypt.org/).
* Pushes on `develop` branch are automatically published on dedicated URL.
* Other branches and GitHub Pull Requests can also get dedicated URLs.

Netlify supports NextJS out-of-the-box so not much was necessary for the setup. Everything can be version-controlled under the `netlify.toml` file (Personally I'm not very fan of the TOML format, and prefer YAML although I know a lot of people don't like it much, but that's just a personal preference), if you have environment variables that are sensitive you can configure them on their UI instead. In our case everything is publishable (yes the Stripe keys are the public ones - don't be sneaky):

```toml
[build]
  command = "npm run build && npm run export"
  publish = "out"

[[plugins]]
package = "netlify-plugin-cache-nextjs"

[context.production.environment]
  NEXT_PUBLIC_LICENSESERVER_URL = ...
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = ...

[context.staging.environment]
  NEXT_PUBLIC_LICENSESERVER_URL = ...
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = ...

[context.branch-deploy.environment]
  NEXT_PUBLIC_LICENSESERVER_URL = ...
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = ...
```

* The `build` section defines the build command and output directory.
* The `plugins` we've setup a cache for NetxtJS to make builds faster.
* The `environment` sections define different variables that are injected during build depending the branch. While on `master` branch we use the production variables, on `develop` branch we test Stripe integration using their test environment. The same variables are also setup in the `env.[local|production|development|test]` files so that we use them outside of Netlify (e.g. a local running instance). `env.local` is not added in the version control so that it can be configured locally by each developer. The variables need to start with prefix `NEXT_PUBLIC_` so that they are accessible from the browser itself ([NextJS doc](https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser)).

> Of course deployment can also be done with [Vercel](https://vercel.com/) the authors of NextJS, there was no particular reason why I chose Netlify instead of Vercel, make sure to check out both before deciding, I'm personally happy with Netlify so I don't have a reason for now to switch.

## Optimisations (Lighthouse)

Once deployed I took a bit of time to make sure the site is optimised properly for web, using [lighthouse](https://developers.google.com/web/tools/lighthouse#:~:text=Lighthouse%20is%20an%20open%2Dsource,the%20quality%20of%20web%20pages.&text=You%20can%20run%20Lighthouse%20in,how%20well%20the%20page%20did.). Once I finished the optimisations here the result was pretty good:

![Lighthouse](/posts/refactoring-landing-page-with-react-nextjs-tailwind/lighthouse.png "Chrome's Lighthouse website report")

One of the things I noticed there was the images I used on the landing page could be compressed better by serving them in [next-gen formats](https://web.dev/uses-webp-images/). I used [cwebp](https://developers.google.com/speed/webp/docs/cwebp) CLI for static PNG and [ezgif.com](https://ezgif.com/) for animated PNGs.

## Conclusion

NextJS is definitely worth to check it out if you're into React, even if you build a simple landing page it provides a great opinionated way to organize pages and components.

The TailwindCSS utility-first design is really cool, I can now do one-of designs on specific components without the need to name each element class on CSS. Although this should be used with caution in bigger projects, to avoid duplication of designs, thankfully custom components can be easily created and re-used as shown in the CSS file.

Lastly, with the image optimisations I gained 1 sec in First-Contentful-Paint time which can improve sales.
