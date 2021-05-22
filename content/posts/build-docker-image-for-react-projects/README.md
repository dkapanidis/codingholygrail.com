---
title: 'Progressively Build an Optimized Docker Image for React Projects'
excerpt: "Using Python and want to run your projects in containers? Let's take a close look on how to build an optimized Dockerfile for Python projects."
coverImage: '/posts/12-awesome-cli-tools/banner.png'
date: '2021-05-22'
author:
  name: Dimitris Kapanidis
  picture: '/images/dkapanidis.jpg'
ogImage:
  url: '/posts/12-awesome-cli-tools/banner.png'
topic: 'react'
---

I have talked recently about building docker images for [Golang] and [Python] projects, today we'll be focusing on building a Docker image for a React project.

[Golang]: /build-docker-image-for-golang-projects
[Python]: /build-docker-image-for-python-projects

## Requirements

Before continuing make sure to have [Node] and [Docker] installed on your machine:

```shellsession
$ node -v
v15.4.0

$ yarn -v
1.22.10

$ docker -v
Docker version 20.10.6, build 370c289
```

## Simple React App

First, let's bootstrap our project using `create-react-app`, I'm using the typescript template as an example:

```shellsession
$ npx create-react-app react-hello-world --template typescript
```

The app can be started with:

```shellsession
$ cd react-hello-world
$ yarn start
```

React app is built and served on port `:3000` locally.

![react-starter](/build-docker-image-for-react-projects/react-starter.png)