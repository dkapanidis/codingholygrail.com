---
title: 'Updating dependencies on node projects'
excerpt: 'How to update the dependencies on node projects'
coverImage: '/posts/12-awesome-cli-tools/banner.png'
date: '2021-10-25'
author:
  name: Dimitris Kapanidis
  picture: '/images/dkapanidis.jpg'
ogImage:
  url: '/posts/12-awesome-cli-tools/banner.png'
slug: 'updating-dependencies-on-node-projects'
topic: 'react'
---

Once a project is built and deployed we still need to put some effort for maintenance. This includes updating dependencies to avoid security issues (and potentially get new fetures along the way).

Here is a quick step-by-step guide how to update your node project dependencies.

### Requirements

Use of `yarn` version 2 is assumed. To switch yarn version per project:

```sh
yarn set version berry
```

### Get list of outdated dependencies

```sh
yarn 
```