---
title: 'Progressively Build an Optimized Docker Image for Golang Projects'
excerpt: "If you 're getting started with a brand new golang project and want to package it inside a container image, this is a good starting point for you."
coverImage: '/posts/12-awesome-cli-tools/banner.png'
date: '2021-05-15'
author:
  name: Dimitris Kapanidis
  picture: '/images/dkapanidis.jpg'
ogImage:
  url: '/posts/12-awesome-cli-tools/banner.png'
topic: 'golang'
---

If you're getting started with a brand new golang project and want to package it inside a docker image, this is a good starting point for you.

I tend to switch programming languages often depending on the project I'm in and in order to help me with the quirks of each language I keep handy cheat-sheets, here is one I have for Golang that includes a quick walkthrough of the [golang basics in less than 10 mins](/learn-go-in-10-mins).

## Requirements

Before continuing make sure to have [Go] and [Docker] installed on your machine:

[Go]: https://golang.org/
[Docker]: https://www.docker.com/

```shellsession
$ go version
go version go1.15.5 darwin/amd64

$ docker -v
Docker version 20.10.6, build 370c289
```

## Simple Web Server

Let's start by writting a simple hello world web server in Go:

Write the following in `main.go`

```go
// main.go

package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/", handler)
	http.ListenAndServe(":8080", nil)
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello world")
}
```

The server can be started with:

```shellsession
$ go run main.go
```

which will compile the source code and run it. The app will listen on port `:8080` locally and when it receives a GET request it will respond with `Hello world`. Leave the app running in a console and on a separate console use curl:

```shellsession
$ curl localhost:8080
Hello world
```

Let's start with a minimal `Dockerfile`:

```dockerfile
# Dockerfile

FROM golang:1.14.2-alpine
WORKDIR /app
COPY main.go .
RUN go build -o ./out/app .
EXPOSE 8080
CMD ["/app/out/app"]
```

* `FROM`: We start with a golang base image based on alpine OS.
* `WORKDIR`: Set the current directory from this point to to be `/app`
* `COPY`: Copy the `main.go` file inside the container image.
* `RUN`: Build the binary from source code.
* `EXPOSE`: Inform docker which port the service will be exposed to.
* `CMD`: define which command gets executed on startup.

To build the docker image, start the container and test it:

```shellsession
$ docker build -t golang-sample .
[+] Building 3.6s (9/9) FINISHED
...

$ docker run -d -p8080:8080 golang-sample
7d087298199b917a1413740a0b92e55d2e37b5cf7e6c6a4763bbfd89af1d25dc

$ curl localhost:8080
Hello world

$ docker stop 7d087298
```

## Multi-stage build

Our example is working great, but along with our binary we also deliver our source code this way:

```shellsession
$ docker run -it --rm golang-sample cat /app/main.go
package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/", handler)
	http.ListenAndServe(":8080", nil)
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello world")
}
```

This is because our final image also includes all previous build layers and since we instructed to `COPY` the source code inside the container image it still resides in the final image.

In order to resolve this we'll split the build process in two images:

```dockerfile
# Dockerfile

# Build image
FROM golang:1.14.2-alpine AS build
WORKDIR /app
COPY main.go .
RUN go build -o ./out/app .

# Runtime image
FROM alpine:3.9
COPY --from=build /app/out/app /usr/local/bin/app
EXPOSE 8080
CMD ["/usr/local/bin/app"]
```

Let's do the build, run & test cycle again now:

```shellsession
$ docker build -t golang-sample .
[+] Building 3.6s (9/9) FINISHED
...

$ docker run -d -p8080:8080 golang-sample
f62c06302497d3a13ed036f98009dd054c506c1b1adcf0bdd4f92514a013f64a

$ curl localhost:8080
Hello world

$ docker stop f62c0630
```

It works and as added bonus the source code is not included now on the final image:

```shellsession
$ docker run -it --rm golang-sample ls /app
ls: /app: No such file or directory
```

## Web Server using Gin

Let's expand our example now to be able to include multiple files and module dependencies.

First of all we need to generate our own `go.mod`:

```shellsession
$ go mod init example.com/golang-sample
go: creating new go.mod: module example.com/golang-sample

$ cat go.mod
module example.com/golang-sample

go 1.15
```

Let's use [gin](https://github.com/gin-gonic/gin) as HTTP web framework:


```shellsession
$ go get -u github.com/gin-gonic/gin
```

Now let's update the `main.go` with the following:

```go
// main.go

package main

import "github.com/gin-gonic/gin"

func main() {
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.String(200, "hello world")
	})
	r.Run("0.0.0.0:8080")
}
```

Follow the same steps as before to run it locally and test it, it performs the same but uses a module dependency.

In order to package it though, we need to add more files than simply the `main.go`, so let's update our Dockerfile:

```dockerfile
# Dockerfile

# Build image
FROM golang:1.14.2-alpine AS build
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o ./out/app .

# Runtime image
FROM alpine:3.9
COPY --from=build /app/out/app /usr/local/bin/app
EXPOSE 8080
CMD ["/usr/local/bin/app"]
```

This will copy all files from our app in the container image, download the module deps and then build our binary before sending it to the runtime image.

But this is a bit inefficient, since every time we change something on our code the build process will have to re-download all modules deps again and again. So let's rephrase that code a bit differently:

```dockerfile
# Dockerfile

# Build image
FROM golang:1.14.2-alpine AS build
WORKDIR /app
COPY go.mod go.sum .
RUN go mod download
COPY . .
RUN go build -o ./out/app .

# Runtime image
FROM alpine:3.9
COPY --from=build /app/out/app /usr/local/bin/app
EXPOSE 8080
CMD ["/usr/local/bin/app"]
```

That's a lot better now, we first copy `go.mod` and `go.sum` and download the deps, if the dependencies change these layers will be invalidated and rerun, otherwise they can be reused for consecutive builds and save some time.

## Web Server project layout

Our example until now is a simple `main.go` file. Let's test if we can use a proper [project layout](https://github.com/golang-standards/project-layout). Create file `pkg/apis/hello.go`:

```go
// pkg/apis/hello.go

package apis

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Hello(c *gin.Context) {
	c.String(http.StatusOK, "hello world")
}
```

Now update `main.go` with:

```go
// main.go

package main

import (
	"example.com/golang-sample/pkg/apis"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("/", apis.Hello)
	r.Run("0.0.0.0:8080")
}
```

Let's build the image again and run it to check it works ok:

```shellsession
$ docker build -t golang-sample .
[+] Building 30.5s (14/14) FINISHED
...

$ docker run -d -p8080:8080 golang-sample
c7fd4fe0823dc91bc567e18b413b7432acffdad40e510d91be5d2b6a731d69a3

$ curl localhost:8080
hello world

$ docker stop c7fd4fe0823d
c7fd4fe0823d
```

## Go Including Unit Tests

What about unit tests? We can add them during our build cycle to make sure we don't get broken tests in production.

Let's write a simple math function in `pkg/math/math.go`:

```go
// pkg/math/math.go

package math

// Add is our function that sums two integers
func Add(x, y int) (res int) {
	return x + y
}

// Subtract subtracts two integers
func Subtract(x, y int) (res int) {
	return x - y
}
```

and let's write some unit tests in `pkg/math/math_test.go`:

```go
// pkg/math/math_test.go

package math

import "testing"

func TestAdd(t *testing.T) {
	got := Add(4, 6)
	want := 10

	if got != want {
		t.Errorf("got %d, wanted %d", got, want)
	}
}

func TestSubtract(t *testing.T) {
	got := Subtract(6, 2)
	want := 4

	if got != want {
		t.Errorf("got %d, wanted %d", got, want)
	}
}
```

Test it locally:

```shellsession
$ go test ./pkg/math -v
=== RUN   TestAdd
--- PASS: TestAdd (0.00s)
=== RUN   TestSubtract
--- PASS: TestSubtract (0.00s)
PASS
ok  	example.com/golang-sample/pkg/math	0.876s
```

Let's add this now during our build process:

```dockerfile
# Dockerfile

# Build image
FROM golang:1.14.2-alpine AS build
WORKDIR /app
COPY go.mod go.sum .
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go test -v ./...
RUN go build -o ./out/app .

# Runtime image
FROM alpine:3.9
COPY --from=build /app/out/app /usr/local/bin/app
EXPOSE 8080
CMD ["/usr/local/bin/app"]
```

If we change the test to fail we can see the build process now stops:

```diff
// pkg/math/math_test.go

func TestSubtract(t *testing.T) {
	got := Subtract(6, 2)
-	want := 4
+	want := 42

	if got != want {
		t.Errorf("got %d, wanted %d", got, want)
	}
}
```

```shellsession
$ docker build -t golang-sample .
[+] Building 43.3s (12/14)
 => [internal] load build definition from Dockerfile                     0.1s
 => => transferring dockerfile: 37B                                      0.0s
 => [internal] load .dockerignore                                        0.1s
 => => transferring context: 2B                                          0.0s
 => [internal] load metadata for docker.io/library/alpine:3.9            0.6s
 => [internal] load metadata for docker.io/library/golang:1.14.2-alpine  0.0s
 => [stage-1 1/2] FROM docker.io/library/alpine:3.9@sha256:414e0518bb92  0.0s
 => [build 1/7] FROM docker.io/library/golang:1.14.2-alpine              0.0s
 => [internal] load build context                                        0.0s
 => => transferring context: 338B                                        0.0s
 => CACHED [build 2/7] WORKDIR /app                                      0.0s
 => CACHED [build 3/7] COPY go.mod go.sum .                              0.0s
 => CACHED [build 4/7] RUN go mod download                               0.0s
 => CACHED [build 5/7] COPY . .                                          0.0s
 => ERROR [build 6/7] RUN CGO_ENABLED=0 go test -v ./...                42.1s
------
 > [build 6/7] RUN CGO_ENABLED=0 go test -v ./...:
#12 41.79 ?     example.com/golang-sample       [no test files]
#12 41.79 ?     example.com/golang-sample/pkg/apis      [no test files]
#12 41.79 === RUN   TestAdd
#12 41.79 --- PASS: TestAdd (0.00s)
#12 41.79 === RUN   TestSubtract
#12 41.79     TestSubtract: math_test.go:19: got 4, wanted 42
#12 41.79 --- FAIL: TestSubtract (0.00s)
#12 41.79 FAIL
#12 41.79 FAIL	example.com/golang-sample/pkg/math	0.008s
#12 41.79 FAIL
------
```

The build process is now taking longer (in my machine it was 27 secs without tests and 45 secs with), but normally I offload the build process to a CI/CD server so it is build async and it can notify me if I missed some unit tests during my dev by failing the build.

Note that we only talk about unit tests here, since integration tests include other services and are better suited in the CI/CD workflow instead of embedding them inside the image build process.

## Reduce Image Size

Let's take a look at the final image size:

```shellsession
$ docker images golang-sample
REPOSITORY      TAG       IMAGE ID       CREATED        SIZE
golang-sample   latest    9a44e42117a8   23 hours ago   22.8MB
```

It's not bad, but we can still do better. We currently used `alpine` as base image, but go generates [mostly](https://oddcode.daveamit.com/2018/08/16/statically-compile-golang-binary/) static binaries so we can also use [distroless] static flavor or even [scratch]:

* [alpine] contains a full OS including a shell to exec into. Use this if you want to enter and debug the container.
* [distroless] static contains ca-certificates, /etc/password entry for a root user, /tmp directory, and timezone data. Use this if your app needs any of the above.
* [scratch] is an empty container image, nothing is included as base.

[alpine]: https://hub.docker.com/_/alpine
[distroless]: https://github.com/GoogleContainerTools/distroless
[scratch]: https://hub.docker.com/_/scratch

In order to make sure the final binaries are statically linked we need to add `CGO_ENABLED=0` to the build process:

```diff
-RUN go build -o ./out/app .
+RUN CGO_ENABLED=0 go build -o ./out/app .
```

| Runtime Image                     | Final Size |
| --------------------------------- | ---------- |
| alpine:3.9                        | 22.8MB     |
| gcr.io/distroless/static-debian10 | 19.1MB     |
| scratch                           | 17.3MB     |

Now let's take a look at the Go binary itself. We can reduce it's own size by adding ldflags that strip debug info from the binaries, and we can also use `upx` to further compress the final binary.

| Parameters         | Compressed with UPX | Final Size |
| ------------------ | ------------------- | ---------- |
| None               | No                  | 15.0 MB    |
| `-ldflags="-s -w"` | No                  | 12.0 MB    |
| None               | Yes                 |  7.2 MB    |
| `-ldflags="-s -w"` | Yes                 |  4.1 MB    |

So let's put this to work in our Dockerfile

```dockerfile
# Dockerfile

# Build image
FROM golang:1.14.2-alpine AS build
RUN apk add upx
WORKDIR /app
COPY go.mod go.sum .
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go test -v ./...
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o ./out/app .
RUN upx ./out/app

# Runtime image
FROM scratch
COPY --from=build /app/out/app /usr/local/bin/app
EXPOSE 8080
CMD ["/usr/local/bin/app"]
```

Let's see the final result!

```shellsession
$ docker images golang-sample
REPOSITORY      TAG       IMAGE ID       CREATED         SIZE
golang-sample   latest    461827301dda   3 seconds ago   4.77MB
```

## Conclusion

In this tutorial you created a simple golang app and gradually packaged it inside a container image, following best practices to avoid injecting the source code in the final build, optimize build time by taking advantage of the cache for dependencies, added unit testing during the build process to avoid delivering broken code to production and optimized the final image size.

Now for your next Go project you know how to fine-tune your `Dockerfile` 🙌️.