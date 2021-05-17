---
title: 'Progressively Build an Optimized Docker Image for Python Projects'
excerpt: "Using Python and want to run your projects in containers? Let's take a close look on how to build an optimized Dockerfile for Python projects."
coverImage: '/posts/12-awesome-cli-tools/banner.png'
date: '2021-05-17'
author:
  name: Dimitris Kapanidis
  picture: '/images/dkapanidis.jpg'
ogImage:
  url: '/posts/12-awesome-cli-tools/banner.png'
topic: 'coding'
---

Using Python and want to run your projects in containers? Let's take a close look on how to build an optimized Dockerfile for Python projects.

Previously we built an optimized docker image for [Golang Projects], now we'll do the same process for Python.

[Golang Projects]: /build-docker-image-for-golang-projects

## Requirements

Before continuing make sure to have [Python 3] and [Docker] installed on your machine:

[Python 3]: https://www.python.org/
[Docker]: https://www.docker.com/

```shellsession
$ python3 --version
Python 3.7.7

$ docker -v
Docker version 20.10.6, build 370c289
```

## Simple Web Server

Let's start with a simple hello world server in Python:

Write the following in `app.py`

```python
# app.py

import http.server
import socketserver

PORT = 5000

class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.wfile.write("Hello world".encode('utf-8'))

with socketserver.TCPServer(("", PORT),  Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
```

The server can be started with:

```shellsession
$ python3 app.py
```

Python is an interpreted language, so there is no need for compilation step, instead it runs directly the code. The app will listen on port `:5000` locally and when it receives a GET request it will respond with `Hello world`. Leave the app running in a console and on a separate console use curl:

```shellssesion
$ curl localhost:5000
Hello world
```

Let's create a minimal `Dockerfile`:

```dockerfile
# Dockerfile

FROM python:3-alpine
WORKDIR /app
COPY app.py /app/
EXPOSE 5000
CMD [ "python3", "-u", "app.py"]
```

* `FROM`: We start with a python 3 base image based on alpine OS.
* `WORKDIR`: Set the current directory from this point to be `/app`
* `COPY`: Copy the `app.py` file inside the container image.
* `EXPOSE`: Inform docker which port the server will be exposed to.
* `CMD`: define which command gets executed on startup. `-u` param is used for unbuffered output.

To build the docker image, start the container and test it:

```shellsession
$ docker build -t python-sample .
[+] Building 1.5s (8/8) FINISHED
...

$ docker run -d -p5000:5000 python-sample
43bed4c8d55083a7cae901c0d5cbea95c4996010ff45ffea2b168c62f5fdc08f

$ curl localhost:5000
Hello world

$ docker stop 43bed4c8
```

## Multi-stage build

Multi-stage builds can separate build and runtime environments, but in interpreted languages such as Python I don't actually see much of a benefit. As an example of such multi-stage I leave below how to use alpine image for `build` and `distroless` for runtime.

```dockerfile
# Dockerfile

FROM python:3-alpine AS build
WORKDIR /app
COPY app.py /app/

FROM gcr.io/distroless/python3
COPY --from=build /app /app
WORKDIR /app
EXPOSE 5000
CMD ["app.py"]
```

Checking the output of both images:

| Base Image                | Base Image Size | Final Size |
| ------------------------- | --------------- | ---------- |
| python:3-alpine           | 44.9MB          | 44.9MB     |
| gcr.io/distroless/python3 | 52.2MB          | 52.2MB     |

Of course, the base image size and final size are identical since we only added our `app.py` file in between. Alpine image is smaller but distroless should be considered more secure by design.

## Web Server using Flask

Let's use now Flask to run a web server instead.

First we install Flask and write the `requirements.txt` file:

```shellsession
$ pip3 install Flask
Collecting Flask
  Downloading Flask-2.0.0-py3-none-any.whl (93 kB)
     |████████████████████████████████| 93 kB 1.6 MB/s
Collecting click>=7.1.2
  Downloading click-8.0.0-py3-none-any.whl (96 kB)
     |████████████████████████████████| 96 kB 4.3 MB/s
Collecting Jinja2>=3.0
  Downloading Jinja2-3.0.0-py3-none-any.whl (133 kB)
     |████████████████████████████████| 133 kB 8.6 MB/s
Collecting Werkzeug>=2.0
  Downloading Werkzeug-2.0.0-py3-none-any.whl (288 kB)
     |████████████████████████████████| 288 kB 8.5 MB/s
Collecting itsdangerous>=2.0
  Downloading itsdangerous-2.0.0-py3-none-any.whl (18 kB)
Collecting MarkupSafe>=2.0.0rc2
  Downloading MarkupSafe-2.0.0-cp37-cp37m-macosx_10_9_x86_64.whl (13 kB)
Installing collected packages: click, MarkupSafe, Jinja2, Werkzeug, itsdangerous, Flask
Successfully installed Flask-2.0.0 Jinja2-3.0.0 MarkupSafe-2.0.0 Werkzeug-2.0.0 click-8.0.0 itsdangerous-2.0.0

$ pip3 freeze | grep Flask > requirements.txt
```

Now let's update our `app.py` with a Flask version:

```python
# app.py

from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello world'
```

To start the app do:

```shellsession
$ python3 -m flask run
```

To test it is working open on a browser `http://localhost:5000`.

Let's update our `Dockerfile` to be able to use dependencies:

```dockerfile
# Dockerfile

FROM python:3-alpine
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .
EXPOSE 5000
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
```

This will copy the `requirements.txt` file that defines our dependencies and install all dependencies before we even add the source code. If the requirements file changes the dependencies layer will be invalidated and run again to fetch the new dependencies, but if it stays the same the cached layer will be reused saving us time during development which is nice.

Let's build the image again and run it to check it works ok:

```shellsession
$ docker build -t python-sample .
[+] Building 0.1s (10/10) FINISHED
...

$ docker run -d -p5000:5000 python-sample
4a0e0e8cbdefd9ebcbcec7f8477305cb027dd08daa03ac4a8ecadd004ba39f1d

$ curl localhost:5000
Hello world

$ docker stop 4a0e0e8cb
```

## Python Including Unit Tests

In order to get a quality gateway on our resulting images we can make sure no images are generated that fail the unit tests by executing them during the build process.

If you're interested in learning more about unit testing in Python there is a nice post [here](https://realpython.com/python-testing/) that describes nicely how to start testing your python app.

I will be using `nose2` test runner on the example so let's install it first:

```shellsession
$ pip3 install nose2
Collecting nose2
  Using cached nose2-0.10.0-py2.py3-none-any.whl (141 kB)
Requirement already satisfied: coverage>=4.4.1 in /usr/local/lib/python3.7/site-packages (from nose2) (5.5)
Requirement already satisfied: six>=1.7 in /usr/local/lib/python3.7/site-packages (from nose2) (1.12.0)
Installing collected packages: nose2
Successfully installed nose2-0.10.0

$ pip3 freeze | grep nose2 >> requirements.txt

$ cat requirements.txt
Flask==2.0.0
nose2==0.10.0
```

Ok, let's write two simple passing tests in `test_example.py`:

```python
# test_example.py

def test_sum():
    assert sum([1, 2, 3]) == 6, "Should be 6"

def test_sum_tuple():
    assert sum((1, 2, 3)) == 6, "Should be 6"
```

Test it locally:

```shellssesion
$ python -m nose2
..
----------------------------------------------------------------------
Ran 2 tests in 0.000s

OK
```

Let's add this now during our build process:

```dockerfile
# Dockerfile

FROM python:3-alpine
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .
RUN python -m nose2
EXPOSE 5000
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
```

If we change the test to fail we can see the build process now stops:

```diff
-    assert sum((1, 2, 3)) == 6, "Should be 6"
+    assert sum((1, 2, 2)) == 6, "Should be 6"
```

```shellsession
$  docker build -t python-sample .
[+] Building 1.0s (10/10) FINISHED
 => [internal] load build definition from Dockerfile                                                             0.0s
 => => transferring dockerfile: 37B                                                                              0.0s
 => [internal] load .dockerignore                                                                                0.0s
 => => transferring context: 2B                                                                                  0.0s
 => [internal] load metadata for docker.io/library/python:3-alpine                                               0.0s
 => [1/6] FROM docker.io/library/python:3-alpine                                                                 0.0s
 => [internal] load build context                                                                                0.0s
 => => transferring context: 884B                                                                                0.0s
 => CACHED [2/6] WORKDIR /app                                                                                    0.0s
 => CACHED [3/6] COPY requirements.txt requirements.txt                                                          0.0s
 => CACHED [4/6] RUN pip3 install -r requirements.txt                                                            0.0s
 => [5/6] COPY . .                                                                                               0.0s
 => ERROR [6/6] RUN python -m nose2                                                                              0.8s
------
 > [6/6] RUN python -m nose2:
#10 0.790 .F
#10 0.791 ======================================================================
#10 0.791 FAIL: test_example.test_sum_tuple
#10 0.791 ----------------------------------------------------------------------
#10 0.791 Traceback (most recent call last):
#10 0.791   File "/app/test_example.py", line 5, in test_sum_tuple
#10 0.791     assert sum((1, 2, 2)) == 6, "Should be 6"
#10 0.791 AssertionError: Should be 6
#10 0.791
#10 0.791 ----------------------------------------------------------------------
#10 0.791 Ran 2 tests in 0.000s
#10 0.791
#10 0.792 FAILED (failures=1)
------
executor failed running [/bin/sh -c python -m nose2]: exit code: 1
```

## Conclusion

In this tutorial you created a simple python web server using Flask, packaged it inside a container image, optimize build time by taking advantage of the cache for dependencies and added unit testing during the build process to avoid broken code to be delivered in production.

You are now ready for your next python 🐍&nbsp; project to be delivered 📦&nbsp; inside containers 🙌️
