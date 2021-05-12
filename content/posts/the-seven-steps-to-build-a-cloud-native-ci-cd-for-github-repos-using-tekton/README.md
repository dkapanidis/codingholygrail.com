---
title: 'The Seven Steps to build a Cloud Native CI/CD for GitHub repos using Tekton'
excerpt: 'Tekton is a powerful framework for creating continuous delivery pipelines in modern infrastructure. It provides the primitive blocks necessary to build your own CI/CD workflows. In this post we’ll be building a CI/CD from scratch on seven steps.'
coverImage: '/posts/12-awesome-cli-tools/banner.png'
date: '2021-01-28T09:12:14.122Z'
author:
  name: Dimitris Kapanidis
  picture: '/images/dkapanidis.jpg'
ogImage:
  url: '/posts/12-awesome-cli-tools/banner.png'
slug: 'the-seven-steps-to-build-a-cloud-native-ci-cd-for-github-repos-using-tekton'
topic: 'kubernetes'
---

[Tekton](https://tekton.dev/) is a powerful framework for creating continuous delivery pipelines in modern infrastructure. It provides the primitive blocks necessary to build your own CI/CD workflows. In this post we’ll be building a CI/CD from scratch on seven steps.

## The CI/CD workflow

The workflow that we’ll be building can be seen in the following diagram:

![Workflow](/posts/the-seven-steps-to-build-a-cloud-native-ci-cd-for-github-repos-using-tekton/workflow.png "The CI/CD workflow")

Push events on our GitHub repo will trigger a push notification that will be sent to our kubernetes cluster (during the tutorial using ngrok tunnel so that we can use a local instance). Tekton will trigger a Pipeline that will first build our image using and push it to a local registry and then will deploy the app under a respective namespace.

The code can be found on [https://github.com/harbur/tekton-tutorial](https://github.com/harbur/tekton-tutorial).

## Step 1. Install Kubernetes

As promised, we’ll be starting from scratch. So first things in order is to start a kubernetes cluster. We’ll be using [minikube](https://github.com/kubernetes/minikube) so make sure to install it first. You should also install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)   so that you can interact with the kubernetes cluster.

We can now start our cluster using the following command:

```sh
❯ minikube start --addons registry --addons registry-aliases
😄  minikube v1.17.0 on Darwin 10.15.7
✨  Automatically selected the hyperkit driver. Other choices: parallels, ssh, virtualbox
👍  Starting control plane node minikube in cluster minikube
🔥  Creating hyperkit VM (CPUs=2, Memory=2200MB, Disk=20000MB) ...
🐳  Preparing Kubernetes v1.20.2 on Docker 20.10.2 ...
    ▪ Generating certificates and keys ...
    ▪ Booting up control plane ...
    ▪ Configuring RBAC rules ...
🔎  Verifying Kubernetes components...
🔎  Verifying registry addon...
🌟  Enabled addons: storage-provisioner, registry-aliases, default-storageclass, registry
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```

To interact with the cluster use kubectl, let’s check the nodes, it should show one node in Ready state:

```sh
❯ kubectl get nodes
NAME       STATUS   ROLES                  AGE    VERSION
minikube   Ready    control-plane,master   106s   v1.20.2
```

We use [registry-aliases](https://github.com/kubernetes/minikube/tree/master/deploy/addons/registry-aliases) minikube addon to run a registry locally and configure DNS to point to the registry. You can push and pull from the registry using example.com as registry URL.

## Namespaces

The following diagram displays the namespaces we’ll be using during the tutorial:

![Namespaces](/posts/the-seven-steps-to-build-a-cloud-native-ci-cd-for-github-repos-using-tekton/namespaces.png)

* The `default` namespace is where all TaskRuns and PipelineRuns of the tutorial will be running.
* The `tekton-pipelines` will be created when we install Tekton so we don't need to prepare anything special.
* The `tekton-tutorial` is where our sample app will be deployed by our CI/CD workflow (The workflow deploys the app on the namespace matching the repo name).

So, before our workflow is able to deploy our app, we need to first create the namespace and grant it privileges:

```sh
# create namespace for sample app
kubectl create namespace tekton-tutorial
# grant privileges to deploy to namespace
kubectl create rolebinding admin \
  --clusterrole admin \
  --namespace tekton-tutorial \
  --serviceaccount default:default
```

## Step 2. Install Tekton

Now that we have cluster up and running, let’s add Tekton. We’ll be using two components of tekton: The tekton pipelines (the core project) and the tekton triggers. Each one can be installed with an one-liner:

```sh
# install tekton (pipeline & triggers)
kubectl apply -f https://storage.googleapis.com/tekton-releases/pipeline/previous/v0.20.1/release.yaml
kubectl apply -f https://storage.googleapis.com/tekton-releases/triggers/previous/v0.11.1/release.yaml
```

## Step 3. Install Build Task

Before continuing you should install tkn CLI for interacting with Tekton and clone the following repo to locate the files described below:

```sh
git clone https://github.com/harbur/tekton-tutorial
cd tekton-tutorial
git checkout 1.0.0
```

The build task uses [buildah](https://buildah.io/) to build and push the image to the registry.

```yaml
# tekton/2.tasks/build-task.yaml
---
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  name: build
spec:
  description: build & push app
  params:
    - name: contextDir
      description: the context dir within source
      default: .
    - name: destinationImage
      description: the fully qualified image name
      default: "$(outputs.resources.builtImage.url)"
    - name: dockerFile
      description: the docker file to used for building the application
      default: Dockerfile
    - name: tlsVerify
      description: tls verify
      type: string
      default: "false"
  resources:
    inputs:
      - name: source
        type: git
    outputs:
      - name: builtImage
        type: image
  steps:
    - name: build-image
      image: quay.io/buildah/stable
      workingDir: "/workspace/source/$(inputs.params.contextDir)"
      command:
        - "buildah"
      args:
        - "bud"
        - "--layers"
        - "-f"
        - "$(inputs.params.dockerFile)"
        - "-t"
        - "$(inputs.params.destinationImage)"
        - "."
      securityContext:
        privileged: true
        runAsUser: 0
      volumeMounts:
        - name: varlibc
          mountPath: /var/lib/containers
    - name: push-image
      image: quay.io/buildah/stable
      workingDir: "/workspace/source/$(inputs.params.contextDir)"
      command:
        - "buildah"
      args:
        - "push"
        - "--tls-verify=$(inputs.params.tlsVerify)"
        - $(inputs.params.destinationImage)
        - "docker://$(inputs.params.destinationImage)"
      securityContext:
        runAsUser: 0
        privileged: true
      volumeMounts:
        - name: varlibc
          mountPath: /var/lib/containers
  volumes:
    - name: varlibc
      emptyDir: {}
```

Apply `build-task.yaml` resource:

```sh
❯ kubectl apply -f tekton/2.tasks/build-task.yaml
task.tekton.dev/build created
```

List the installed tasks:

```sh
❯ tkn task list
NAME    DESCRIPTION        AGE
build   build & push app   3 seconds ago
```

There is a lot to unpack here. We’ll go step-by-step and explain first how to run the code locally using go in your machine, then compile it inside a docker image and run it as a container, and lastly we'll trigger the build task to compile the image and push it to the local registry.

Each of the steps below are independent between each other, so if you’re confortable you can skip (3a) or (3b) of the following steps. Step (3c) is necessary to be run at least once so that a built image is ready to be deployed on next stage.

### Step 3a. Run Go app

Before running the `build` task, let's try to build and run the code locally first.

To run the code execute and leave it running:

```sh
go run main.go
```

The app is now listening to port `:8080` so let's test it using curl on a separate console:

```sh
❯ curl localhost:8080/there
Hello, there!%
```

### Step 3b. Run Docker image

To build the docker image run:

```sh
❯ docker build -t tekton-tutorial .
Sending build context to Docker daemon  364.5kB
Step 1/7 : FROM golang:1.14.2-alpine AS build
1.14.2-alpine: Pulling from library/golang
cbdbe7a5bc2a: Pull complete
408f87550127: Pull complete
fe522b08c979: Pull complete
618fff1cf170: Pull complete
0d8b518583db: Pull complete
Digest: sha256:9b3ad7928626126b72b916609ad081cfb6c0149f6e60cef7fc1e9e15a0d1e973
Status: Downloaded newer image for golang:1.14.2-alpine
 ---> dda4232b2bd5
Step 2/7 : COPY main.go .
 ---> 80e4093a0f0d
Step 3/7 : RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .
 ---> Running in 35f01c2a39c3
Removing intermediate container 35f01c2a39c3
 ---> f31a08a3c7e4
Step 4/7 : FROM scratch
 --->
Step 5/7 : COPY --from=build /go/app /bin/
 ---> f2001138dd15
Step 6/7 : EXPOSE 8080
 ---> Running in 0db12d023d6d
Removing intermediate container 0db12d023d6d
 ---> 94128d6b2222
Step 7/7 : CMD ["app"]
 ---> Running in fdb272576f2c
Removing intermediate container fdb272576f2c
 ---> ff7bfe39b3d9
Successfully built ff7bfe39b3d9
Successfully tagged tekton-tutorial:latest
```

Run the container and test it with `curl` on port `8080`:

```sh
# Run tekton-tutorial
❯ docker run --name tekton-tutorial -dp 8080:8080 tekton-tutorial
8abc5b4fb9a5c86c4e0e225317977cac424699cdb3133c098e3cc32936a550bc
# test it
❯ curl localhost:8080/there
Hello, there!%
# tear-down
❯ docker rm -f tekton-tutorial
```

> Note that the Dockerfile is using multistage build so that the final image doesn’t include the source code and build tools (more specifically it uses empty scratch base image since go can be statically built).

### Step 3c. Run Build task

Let’s start the build task:

```sh
❯ tkn task start build
no pipeline resource of type "git" found in namespace: default
Please create a new "git" resource for pipeline resource "source"
? Enter a name for a pipeline resource :
```

It mentions that there is no pipeline resource type `git` found and prompts us to fill in the details. Let's cancel instead, and create the resources directly.

The build task uses two pipeline resources:
* a type `git` as input resource which represents the input git repository where the code will be checked out from.
* a type `image` as output resource which represents the output container image that will be pushed to registry.

Instead of filling manually on CLI, let’s create these two resources from a file.

> Note: These pipelineresources are only necessary when running the tasks and pipeline manually as we do here, since on the final setup these parameters are passed from the payload of the github trigger.

```sh
❯ kubectl apply -f tekton/1.resources/
pipelineresource.tekton.dev/tekton-tutorial-git created
pipelineresource.tekton.dev/tekton-tutorial-image created
```

Now let’s start the task again:

```sh
❯ tkn task start build
? Choose the git resource to use for source: tekton-tutorial-git (https://github.com/harbur/tekton-tutorial#main)
? Choose the image resource to use for builtImage: tekton-tutorial-image (example.com/harbur/tekton-tutorial)
? Value for param `contextDir` of type `string`? (Default is `.`) .
? Value for param `destinationImage` of type `string`? (Default is `$(outputs.resources.builtImage.url)`) $(outputs.resources.builtImage.url)
? Value for param `dockerFile` of type `string`? (Default is `Dockerfile`) Dockerfile
? Value for param `tlsVerify` of type `string`? (Default is `false`) false
TaskRun started: build-run-55rvb
In order to track the TaskRun progress run:
tkn taskrun logs build-run-55rvb -f -n default
```

It prompts you to choose parameter values, continue with the defaults and wait for the pod to start (First run may take a minute or so to download the image):


```sh
❯ kubectl get pod -w
NAME                        READY   STATUS            RESTARTS   AGE
build-run-55rvb-pod-hptkw   0/5     PodInitializing   0          51s
```

Check the logs of the TaskRun to see the progress of the compilation:

```sh
❯ tkn taskrun logs -L -f
[git-source-source-nbm56] {"level":"info","ts":1611575486.87084,"caller":"git/git.go:165","msg":"Successfully cloned https://github.com/harbur/tekton-tutorial @ 7000f44dee568bfff166360e1a9bdf5b9f6d2790 (grafted, HEAD, origin/main) in path /workspace/source"}
[git-source-source-nbm56] {"level":"info","ts":1611575486.9887836,"caller":"git/git.go:203","msg":"Successfully initialized and updated submodules in path /workspace/source"}
[build-image] STEP 1: FROM golang:1.14.2-alpine AS build
[build-image] Completed short name "golang" with unqualified-search registries (origin: /etc/containers/registries.conf)
[build-image] Getting image source signatures
[build-image] Copying blob sha256:cbdbe7a5bc2a134ca8ec91be58565ec07d037386d1f1d8385412d224deafca08
[build-image] Copying blob sha256:0d8b518583db0dc830a3a43c739d6cc91b7610c09d9eba918ae54b20a1dcd18c
[build-image] Copying blob sha256:fe522b08c9798748151fec9b7a908aca712cd102cfcbb8ed79d57d05b71e6cc4
[build-image] Copying blob sha256:618fff1cf170e1785ab64028237182717bc1e1287d03cf0888e424b7563ae5df
[build-image] Copying blob sha256:408f875501273f3af2a9cbff2a23e736585641e73da80dd81712518b28e7843c
[build-image] Copying config sha256:dda4232b2bd580bbf633be12d62e8d0e00f6b7bd60ea6faee157bad1809c53c4
[build-image] Writing manifest to image destination
[build-image] Storing signatures
[build-image] STEP 2: COPY main.go .
[build-image] --> 6e1697caffd
[build-image] STEP 3: RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .
[build-image] --> 55e22e2278c
[build-image] STEP 4: FROM scratch
[build-image] STEP 5: COPY --from=build /go/app /bin/
[build-image] --> f59a8f6fe9b
[build-image] STEP 6: EXPOSE 8080
[build-image] --> 5b57d9eaa58
[build-image] STEP 7: CMD ["app"]
[build-image] STEP 8: COMMIT example.com/harbur/tekton-tutorial
[build-image] --> bac5a87e870
[build-image] bac5a87e870b9ae2ab1684c55a032b084f8b5eac90754339aceaa08b1e53b6a0
[push-image] Getting image source signatures
[push-image] Copying blob sha256:f8ae64caa97c1fe2b8e29d76b9f89caf17f81112b65ff4ab891f2a2b9a891113
[push-image] Copying config sha256:bac5a87e870b9ae2ab1684c55a032b084f8b5eac90754339aceaa08b1e53b6a0
[push-image] Writing manifest to image destination
[push-image] Storing signatures
[image-digest-exporter-9lpxd] {"severity":"INFO","timestamp":"2021-01-25T11:52:56.258420557Z","caller":"logging/config.go:115","message":"Successfully created the logger.","logging.googleapis.com/labels":{},"logging.googleapis.com/sourceLocation":{"file":"github.com/tektoncd/pipeline/vendor/knative.dev/pkg/logging/config.go","line":"115","function":"github.com/tektoncd/pipeline/vendor/knative.dev/pkg/logging.newLoggerFromConfig"}}
[image-digest-exporter-9lpxd] {"severity":"INFO","timestamp":"2021-01-25T11:52:56.258726744Z","caller":"logging/config.go:116","message":"Logging level set to: info","logging.googleapis.com/labels":{},"logging.googleapis.com/sourceLocation":{"file":"github.com/tektoncd/pipeline/vendor/knative.dev/pkg/logging/config.go","line":"116","function":"github.com/tektoncd/pipeline/vendor/knative.dev/pkg/logging.newLoggerFromConfig"}}
[image-digest-exporter-9lpxd] {"severity":"INFO","timestamp":"2021-01-25T11:52:56.264141916Z","caller":"imagedigestexporter/main.go:59","message":"No index.json found for: builtImage","commit":"95144d9","logging.googleapis.com/labels":{},"logging.googleapis.com/sourceLocation":{"file":"github.com/tektoncd/pipeline/cmd/imagedigestexporter/main.go","line":"59","function":"main.main"}}
```

Check the status of the TaskRuns:

```sh
❯ tkn taskrun list
NAME              STARTED         DURATION    STATUS
build-run-55rvb   7 minutes ago   2 minutes   Succeeded
```

Check more details of `build` Task:

```sh
❯ tkn task describe build
Name:          build
Namespace:     default
Description:   build & push app
📨 Input Resources
 NAME       TYPE
 ∙ source   git
📡 Output Resources
 NAME           TYPE
 ∙ builtImage   image
⚓ Params
 NAME                 TYPE     DESCRIPTION              DEFAULT VALUE
 ∙ contextDir         string   the context dir wit...   .
 ∙ destinationImage   string   the fully qualified...   $(outputs.resources.builtImage.url)
 ∙ dockerFile         string   the docker file to ...   Dockerfile
 ∙ tlsVerify          string   tls verify               false
📝 Results
 No results
📂 Workspaces
 No workspaces
🦶 Steps
 ∙ build-image
 ∙ push-image
🗂  Taskruns
NAME              STARTED         DURATION   STATUS
build-run-dhxx4   3 minutes ago   1 minute   Succeeded
```

### Step 4. Install Deploy Task

The deploy task uses an image that contains `kubectl` in order to apply the resources to the cluster. The task needs to run with sufficient privileges to be able to apply the resources.

```sh
# tekton/2.tasks/deploy-task.yaml
---
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  name: deploy
spec:
  description: deploy & restart app
  resources:
    inputs:
      - name: source
        type: git
  params:
    - name: pathToYamlFiles
      description: The path to the yaml files to deploy within the git source
      default: k8s
    - name: namespace
      description: The namespace where to deploy the resources
      default: default
    - name: pathToRolloutYaml
      description: The path to the yaml file to perform rollout after applying resources
      default: deploy.yaml
  steps:
    - name: run-kubectl
      image: lachlanevenson/k8s-kubectl
      workingDir: "/workspace/source/$(inputs.params.pathToYamlFiles)"
      command: ["kubectl"]
      args:
        - "apply"
        - "-n"
        - "$(inputs.params.namespace)"
        - "-f"
        - "/workspace/source/$(inputs.params.pathToYamlFiles)"
    - name: rollout-deploy
      image: lachlanevenson/k8s-kubectl
      workingDir: "/workspace/source/$(inputs.params.pathToYamlFiles)"
      command: ["kubectl"]
      args:
        - "rollout"
        - "restart"
        - "-n"
        - "$(inputs.params.namespace)"
        - "-f"
        - "$(inputs.params.pathToRolloutYaml)"
```

Apply `deploy-task.yaml` resource:

```sh
❯ kubectl apply -f tekton/2.tasks/deploy-task.yaml
task.tekton.dev/deploy created
```

List the installed tasks:

```sh
❯ tkn task list
NAME     DESCRIPTION            AGE
build    build & push app       1 hour ago
deploy   deploy & restart app   6 seconds ago
```

Let’s start the deploy task with param `namespace:tekton-tutorial` and the rest with default values:

```sh
❯ tkn task start deploy -p namespace=tekton-tutorial --showlog
? Choose the git resource to use for source: tekton-tutorial-git (https://github.com/harbur/tekton-tutorial#main)
TaskRun started: deploy-run-49hcs
Waiting for logs to be available...
[git-source-source-zvvkh] {"level":"info","ts":1611582761.8638577,"caller":"git/git.go:165","msg":"Successfully cloned https://github.com/harbur/tekton-tutorial @ 869979df85d6cacfb5ff6ef29cb3fdd1148c00f3 (grafted, HEAD, origin/main) in path /workspace/source"}
[git-source-source-zvvkh] {"level":"info","ts":1611582761.9101276,"caller":"git/git.go:203","msg":"Successfully initialized and updated submodules in path /workspace/source"}
[run-kubectl] deployment.apps/tekton-tutorial created
[run-kubectl] service/tekton-tutorial created
[rollout-deploy] deployment.apps/tekton-tutorial restarted
```

Check the resources on `tekton-tutorial` namespace:

```sh
❯ kubectl get deploy,pod,svc -n tekton-tutorial
NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/tekton-tutorial   1/1     1            1           3m19s
NAME                                  READY   STATUS    RESTARTS   AGE
pod/tekton-tutorial-f54d695df-gpcfm   1/1     Running   0          2m17s
NAME                      TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
service/tekton-tutorial   NodePort   10.102.111.124   <none>        8080:31616/TCP   3m19s
```

Open service on browser:

```sh
❯ minikube service tekton-tutorial -n tekton-tutorial
|-----------------|-----------------|-------------|----------------------------|
|    NAMESPACE    |      NAME       | TARGET PORT |            URL             |
|-----------------|-----------------|-------------|----------------------------|
| tekton-tutorial | tekton-tutorial |        8080 | http://192.168.64.64:31411 |
|-----------------|-----------------|-------------|----------------------------|
🎉  Opening service tekton-tutorial/tekton-tutorial in default browser...
```

To delete the app:

```sh
❯ kubectl delete -f k8s -n tekton-tutorial
deployment.apps "tekton-tutorial" deleted
service "tekton-tutorial" deleted
```

### Step 5. Install Build and Deploy Pipeline

The build-and-deploy pipeline triggers the tasks in series, waiting first for build to finish and then it (re)deploys the app.

```yaml
# tekton/3.pipelines/build-and-deploy-pipeline.yaml
---
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: build-and-deploy
spec:
  params:
    - name: contextDir
      description: the context directory from where to build the application
    - name: namespace
      description: the namespace where to deploy the resources
  resources:
    - name: appSource
      type: git
    - name: appImage
      type: image
  tasks:
    - name: build-app
      taskRef:
        name: build
      params:
        - name: contextDir
          value: $(params.contextDir)
      resources:
        inputs:
          - name: source
            resource: appSource
        outputs:
          - name: builtImage
            resource: appImage
    - name: deploy-kubernetes-service
      taskRef:
        name: deploy
      runAfter:
        - build-app
      params:
        - name: namespace
          value: $(params.namespace)
      resources:
        inputs:
          - name: source
            resource: appSource
```

Apply `build-and-deploy-pipeline.yaml` resource:

```sh
❯ kubectl apply -f tekton/3.pipelines/build-and-deploy-pipeline.yaml
pipeline.tekton.dev/build-and-deploy created
```

List the installed pipelines:

```sh
❯ tkn pipeline list
NAME               AGE              LAST RUN   STARTED   DURATION   STATUS
build-and-deploy   23 seconds ago   ---        ---       ---        ---
```

Let’s start the build-and-deploy pipeline with param `namespace:tekton-tutorial` and the rest with default values:


```sh
❯ tkn pipeline start build-and-deploy -p namespace=tekton-tutorial -p contextDir=. --showlog
? Choose the git resource to use for appSource: tekton-tutorial-git (https://github.com/harbur/tekton-tutorial#main)
? Choose the image resource to use for appImage: tekton-tutorial-image (example.com/harbur/tekton-tutorial)
PipelineRun started: build-and-deploy-run-pjll7
Waiting for logs to be available...
[build-app : git-source-source-dvd2s] {"level":"info","ts":1611664432.887035,"caller":"git/git.go:165","msg":"Successfully cloned https://github.com/harbur/tekton-tutorial @ b759cfd97bc8cbe6a274524a44cccb1bf7f20602 (grafted, HEAD, origin/main) in path /workspace/source"}
[build-app : git-source-source-dvd2s] {"level":"info","ts":1611664432.9256063,"caller":"git/git.go:203","msg":"Successfully initialized and updated submodules in path /workspace/source"}
[build-app : build-image] STEP 1: FROM golang:1.14.2-alpine AS build
[build-app : build-image] Completed short name "golang" with unqualified-search registries (origin: /etc/containers/registries.conf)
[build-app : build-image] Getting image source signatures
[build-app : build-image] Copying blob sha256:fe522b08c9798748151fec9b7a908aca712cd102cfcbb8ed79d57d05b71e6cc4
[build-app : build-image] Copying blob sha256:618fff1cf170e1785ab64028237182717bc1e1287d03cf0888e424b7563ae5df
[build-app : build-image] Copying blob sha256:cbdbe7a5bc2a134ca8ec91be58565ec07d037386d1f1d8385412d224deafca08
[build-app : build-image] Copying blob sha256:0d8b518583db0dc830a3a43c739d6cc91b7610c09d9eba918ae54b20a1dcd18c
[build-app : build-image] Copying blob sha256:408f875501273f3af2a9cbff2a23e736585641e73da80dd81712518b28e7843c
[build-app : build-image] Copying config sha256:dda4232b2bd580bbf633be12d62e8d0e00f6b7bd60ea6faee157bad1809c53c4
[build-app : build-image] Writing manifest to image destination
[build-app : build-image] Storing signatures
[build-app : build-image] STEP 2: COPY main.go .
[build-app : build-image] --> fa3ed514199
[build-app : build-image] STEP 3: RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .
[build-app : build-image] --> bb6c0c951b1
[build-app : build-image] STEP 4: FROM scratch
[build-app : build-image] STEP 5: COPY --from=build /go/app /bin/
[build-app : build-image] --> 7e8dfe11d4d
[build-app : build-image] STEP 6: EXPOSE 8080
[build-app : build-image] --> aafec16c3d2
[build-app : build-image] STEP 7: CMD ["app"]
[build-app : build-image] STEP 8: COMMIT example.com/harbur/tekton-tutorial
[build-app : build-image] --> 4d7c84b4adf
[build-app : build-image] 4d7c84b4adfa31307f14a0b25bf46064dbc59b6253ea4af87b2fc183be02cdcc
[build-app : push-image] Getting image source signatures
[build-app : push-image] Copying blob sha256:98f06537ef69ea0ee68097418a892305e96de2443f54aa6847b4f346a23b8e30
[build-app : push-image] Copying config sha256:4d7c84b4adfa31307f14a0b25bf46064dbc59b6253ea4af87b2fc183be02cdcc
[build-app : push-image] Writing manifest to image destination
[build-app : push-image] Storing signatures
[build-app : image-digest-exporter-fjdlc] {"severity":"INFO","timestamp":"2021-01-26T12:35:18.022472554Z","caller":"logging/config.go:115","message":"Successfully created the logger.","logging.googleapis.com/labels":{},"logging.googleapis.com/sourceLocation":{"file":"github.com/tektoncd/pipeline/vendor/knative.dev/pkg/logging/config.go","line":"115","function":"github.com/tektoncd/pipeline/vendor/knative.dev/pkg/logging.newLoggerFromConfig"}}
[build-app : image-digest-exporter-fjdlc] {"severity":"INFO","timestamp":"2021-01-26T12:35:18.022566045Z","caller":"logging/config.go:116","message":"Logging level set to: info","logging.googleapis.com/labels":{},"logging.googleapis.com/sourceLocation":{"file":"github.com/tektoncd/pipeline/vendor/knative.dev/pkg/logging/config.go","line":"116","function":"github.com/tektoncd/pipeline/vendor/knative.dev/pkg/logging.newLoggerFromConfig"}}
[build-app : image-digest-exporter-fjdlc] {"severity":"INFO","timestamp":"2021-01-26T12:35:18.022905755Z","caller":"imagedigestexporter/main.go:59","message":"No index.json found for: builtImage","commit":"95144d9","logging.googleapis.com/labels":{},"logging.googleapis.com/sourceLocation":{"file":"github.com/tektoncd/pipeline/cmd/imagedigestexporter/main.go","line":"59","function":"main.main"}}
[deploy-kubernetes-service : git-source-source-p5629] {"level":"info","ts":1611664529.7642481,"caller":"git/git.go:165","msg":"Successfully cloned https://github.com/harbur/tekton-tutorial @ b759cfd97bc8cbe6a274524a44cccb1bf7f20602 (grafted, HEAD, origin/main) in path /workspace/source"}
[deploy-kubernetes-service : git-source-source-p5629] {"level":"info","ts":1611664529.8076272,"caller":"git/git.go:203","msg":"Successfully initialized and updated submodules in path /workspace/source"}
[deploy-kubernetes-service : run-kubectl] deployment.apps/tekton-tutorial unchanged
[deploy-kubernetes-service : run-kubectl] service/tekton-tutorial unchanged
[deploy-kubernetes-service : rollout-deploy] deployment.apps/tekton-tutorial restarted
```

Check the resources on `tekton-tutorial` namespace:

```sh
❯ kubectl get deploy,pod,svc -n tekton-tutorial
NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/tekton-tutorial   1/1     1            1           43s

NAME                                  READY   STATUS    RESTARTS   AGE
pod/tekton-tutorial-58f59757c-6dsbr   1/1     Running   0          43s

NAME                      TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/tekton-tutorial   NodePort   10.110.24.217   <none>        8080:31348/TCP   43s
```

Open service on browser:

```sh
❯ minikube service tekton-tutorial -n tekton-tutorial
|-----------------|-----------------|-------------|----------------------------|
| NAMESPACE       |      NAME       | TARGET PORT |            URL             |
|-----------------|-----------------|-------------|----------------------------|
| tekton-tutorial | tekton-tutorial |        8080 | http://192.168.64.55:30357 |
|-----------------|-----------------|-------------|----------------------------|
🎉  Opening service tekton-tutorial/tekton-tutorial in default browser...
```

To delete the app:

```sh
❯ kubectl delete -f k8s -n tekton-tutorial
deployment.apps "tekton-tutorial" deleted
service "tekton-tutorial" deleted
```

### Step 6. Install GitHub Trigger

This step installs the GitHub trigger.

Apply tekton triggers resources:

```sh
❯ kubectl apply -f tekton/4.triggers
eventlistener.triggers.tekton.dev/github-listener-interceptor created
serviceaccount/tekton-triggers-github-sa created
role.rbac.authorization.k8s.io/tekton-triggers-example-minimal created
rolebinding.rbac.authorization.k8s.io/tekton-triggers-example-binding created
clusterrole.rbac.authorization.k8s.io/tekton-triggers-example-clusterrole created
clusterrolebinding.rbac.authorization.k8s.io/tekton-triggers-example-clusterbinding created
triggerbinding.triggers.tekton.dev/github-binding created
triggertemplate.triggers.tekton.dev/github-template created
```

Create `github-secret` secret with a random `TEKTON_TUTORIAL_SECRET_TOKEN`. Annotate the token as you'll use it later in GitHub to send authenticated triggers.

```sh
export TEKTON_TUTORIAL_SECRET_TOKEN=${TEKTON_TUTORIAL_SECRET_TOKEN-$(head -c 24 /dev/random | base64)}
kubectl create secret generic github-secret --from-literal=secretToken=$TEKTON_TUTORIAL_SECRET_TOKEN
echo "TEKTON_TUTORIAL_SECRET_TOKEN: $TEKTON_TUTORIAL_SECRET_TOKEN"
```

### Step 7. Setup GitHub Trigger

On this section we’ll be preparing a webhook trigger on the GitHub repository so that push events send a notification to our cluster.

***Expose Endpoint***

Before configuring the GitHub to send events, we need a public endpoint so where GitHub can send the events. Since we’re running the tutorial locally we need a bastion to redirect the events. In a real scenario you may have your real cluster on a cloud provider and configured an ingress controller to expose the Service. We’ll bypass all this since it’s not the core concept here by port-forwarding the Service to expose it from the cluster and then use ngrok to tunnel it to a public endpoint.

The service we want to expose is `el-github-listener-interceptor`:

```sh
❯ kubectl get svc el-github-listener-interceptor
NAME                             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
el-github-listener-interceptor   ClusterIP   10.97.199.160   <none>        8080/TCP   70m
```

Let’s expose it locally (keep the terminal open):

```sh
❯ kubectl port-forward svc/el-github-listener-interceptor 8080
Forwarding from 127.0.0.1:8080 -> 8000
Forwarding from [::1]:8080 -> 8000
```

we can test it using curl:

```sh
❯ curl localhost:8080
{"eventListener":"github-listener-interceptor","namespace":"tekton-pipelines","eventID":"7knkb"}
```

Now let’s expose it with `ngrok` to a public endpoint (keep the terminal open):

```sh
❯ ngrok http 8080
ngrok by @inconshreveable
Session Status                online
Account                       Dimitris Kapanidis (Plan: Free)
Version                       2.3.35
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://fee0efb0825d.ngrok.io -> http://localhost:8080
Forwarding                    https://fee0efb0825d.ngrok.io -> http://localhost:8080
```

Now let’s test the public endpoint:

```sh
❯ curl http://fee0efb0825d.ngrok.io
{"eventListener":"github-listener-interceptor","namespace":"tekton-pipelines","eventID":"7knkb"}
```

> Bear in mind that the url is ephemeral and will change every time you re-open your tunnel, leave it open during the tutorial.


### Setup Webhook

First of all we need a repository to build, you can clone the same repo as it already contains an example to build and deploy, but any repository can be injected here as long as it has a Dockerfile and a k8s directory.

Fork Repository https://github.com/harbur/tekton-tutorial:

![Fork](/posts/the-seven-steps-to-build-a-cloud-native-ci-cd-for-github-repos-using-tekton/fork.png)

Go to Settings > Webhooks:

![Webhooks](/posts/the-seven-steps-to-build-a-cloud-native-ci-cd-for-github-repos-using-tekton/webhooks.png)

Add Webhook:

![AddWebhook](/posts/the-seven-steps-to-build-a-cloud-native-ci-cd-for-github-repos-using-tekton/add-webhook.png)

Configure webhook:

* Payload URL: The public endpoint.
* Content type: `application/json`
* Secret: The `SECRET_TOKEN` generated while installing github trigger.
* Which events would you like to trigger this webhook? Just the push event.

Our workflow is now ready to be tested.

### Let’s trigger the pipeline

Let’s to a simple change to our code and see the magic work by changing the response text in `main.go`:

```diff
func HelloServer(w http.ResponseWriter, r *http.Request) {
-       fmt.Fprintf(w, "Hello")
+       fmt.Fprintf(w, "Hello, this is awesome!!")
 }
```

Commit the code and push it to the remote repostory. A new PipelineRun should be triggered on your cluster instantly:

```sh
❯ tkn pr ls
NAME                         STARTED          DURATION     STATUS
github-run-ntgx5             7 seconds ago    ---          Running
```

After a while the PipelineRun should finish:

```sh
❯ tkn pr list
NAME                         STARTED         DURATION    STATUS
github-run-7xgnp             3 minutes ago   2 minutes   Succeeded
```

And the service should be deployed on `tekton-tutorial` :


```sh
❯ kubectl get deploy,pod,svc -n tekton-tutorial
NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/tekton-tutorial   1/1     1            1           43s
NAME                                  READY   STATUS    RESTARTS   AGE
pod/tekton-tutorial-58f59757c-6dsbr   1/1     Running   0          43s
NAME                      TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/tekton-tutorial   NodePort   10.110.24.217   <none>        8080:31348/TCP   43s
```

If you open the service it should now display the fancy new text message:

```sh
❯ curl $(minikube service tekton-tutorial -n tekton-tutorial --url)
Hello, this is awesome!!
```

## Conclusion

Tekton provides the primitives to automate tasks and build workflows on your cluster, which can be leveraged to build lightweight CI/CD delivery pipelines.

At [Kubernetic](https://kubernetic.com/) desktop client we’ve integrated Tekton resources so that you can navigate between Tasks & Pipelines and see the aggregated logs of each execution easily:

![Kubernetic](/posts/the-seven-steps-to-build-a-cloud-native-ci-cd-for-github-repos-using-tekton/kubernetic.gif "Kubernetic integration with Tekton")

Hope you enjoyed our tutorial, you can try Kubernetic for free during our 30 day trial period, no registration is required.
