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
$ npx create-react-app react-sample --template typescript
```

The app can be started with:

```shellsession
$ cd react-sample
$ yarn start
```

React app is built and served on port `:3000` locally.

![react-starter](/posts/build-docker-image-for-react-projects/react-starter.png)


Let's create a minimal `Dockerfile`:

```dockerfile
# Dockerfile

FROM node:15.13.0-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "start"]
```

* `FROM`: We start with a node image based on alpine OS.
* `WORKDIR`: Set the current directory from this point to be /app
* `COPY`: Copy the package.json & yarn.lock file inside the container image.
* `RUN`: Install dependencies using `yarn install`.
* `COPY`: Copy source code.
* `EXPOSE`: Inform docker which port the server will be exposed to.
* `CMD`: define which command gets executed on startup.

Also let's add a `.dockerignore` file to avoid adding our local dependencies inside the container image:

```sh
#  .dockerignore

node_modules/
```

To build the docker image, start and test it:

```shellsession 
$ docker build -t react-sample .
[+] Building 0.8s (10/10) FINISHED
...

$ docker run -d -p3000:3000 react-sample
effa6ecd4d320677b1055cefa82fe32b0eddd136ad17e6e50730e95d91838a25

# wait for server to start
$ docker logs effa6ecd

# open on browser http://localhost:3000

$ docker stop effa6ecd
```

## Multi-Stage & Optimized Production Build

We started our react app on our previous example but you probably noticed that it takes some time on startup to load, this is because the compilation of our source code is done during container startup instead of the build stage. Also, we have started our react app in development mode, which includes stuff such as watching for file changes and hot-reload.

Instead we want a production build which in react can be done by running `yarn build` and placing the output in a static web server such as an `nginx`.

We can do that by updating our Dockerfile:

```dockerfile
# Dockerfile

# build environment
FROM node:15.13.0-alpine as build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# runtime environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/ /etc/nginx/conf.d/
```

Now our build is done on our build image, and then we use a separate final image which is based on `nginx` and we include the output of the previous build and some default config under `conf.d/default.conf`:

```nginx
# /conf.d/default.conf

server {

  listen 80;

  location / {
    root   /usr/share/nginx/html;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  error_page   500 502 503 504  /50x.html;

  location = /50x.html {
    root   /usr/share/nginx/html;
  }

}
```

As added benefit since we use multi-stage builds the source code is no longer added in the final image, just the minified production build.

## Conclusion

If you're interested in deploying React alongside other apps inside a Kubernetes cluster, this is hopefully a great starting point to prepare your Dockerfile for your React.
