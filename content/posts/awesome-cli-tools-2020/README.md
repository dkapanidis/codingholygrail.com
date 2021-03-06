---
title: '12 Awesome CLI tools to supercharge your Cloud Native terminal'
excerpt: 'I like to keep my terminal lean and productive, here is a list of some awesome tools to help you with your daily work'
coverImage: '/posts/awesome-cli-tools-2020/banner.png'
date: '2020-11-18T05:35:07.322Z'
author:
  name: Dimitris Kapanidis
  picture: '/images/dkapanidis.jpg'
ogImage:
  url: '/posts/awesome-cli-tools-2020/banner.png'
topic: 'terminal'
---

![Banner](/posts/awesome-cli-tools-2020/banner.png)

I like to keep my terminal lean and productive, here is a list of some awesome tools to help you with your daily work

* Brew
* Alfred
* iTerm2
* Zsh
* Powerlevel10k
* Meslo Nerd Font
* z
* Kubectl
* Kubectx
* Helm
* Stern
* Kubernetic

## 1. Brew package manager (Mac)

I use [Brew](https://brew.sh/) for installing everything on my Mac. To install brew itself simply run:

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

## 2. Alfred Productivity App (Mac)

Alfred is an application launcher for Mac which is not directly terminal related but I use it to start my terminal, so worth the mention.

![Alfred](/posts/awesome-cli-tools-2020/alfred.png)

Keyboard shortcut just the one and only:

* `Cmd+Space`: Open Alfred app


* Installation: `brew install alfred`
* Alternatives: [QuickSilver](https://qsapp.com/), [Launchbar](https://www.obdev.at/products/launchbar/), Spotilight.

## 3. iTerm2 (Mac)

As a terminal emulator I prefer to use iTerm2, which integrates great with other tools in this list. Some of my favourite features are spawning multiple terminals to work with.

![Iterm2](/posts/awesome-cli-tools-2020/iterm2.png)

Keyboard shortcuts I use daily:

* `Cmd+Enter`: Fullscreen mode.
* `Cmd+D`: Split horizontally.
* `Cmd+[` or `Cmd+]`: Next or previous terminal.
* `Cmd+t`: New tab terminal.
* `Cmd+Alt+i`: Broadcast input to all panes in current tab.

The last one I'm not using daily, but it super helpful in case you want to perform a repetitive work in multiple folders | servers | containers | clusters.

* Installation: `brew install iterm2`
* Alternatives: [Alacritty](https://github.com/alacritty/alacritty) (Mac, Linux, Win), [Kitty](https://sw.kovidgoyal.net/kitty/) (Mac, Linux)

## 4. Zsh Shell

Choosing a shell is something of a personal preference, I chose some time ago zsh and have sticked to it since then.

* Installation: `brew install zsh`
* Alternatives: [Fish](https://fishshell.com/), [Bash](https://www.gnu.org/software/bash/)

## 5. Powerlevel10k theme for Zsh

Powerlevel10k (or p10k) is a zsh theme that greatly improves the UX of the CLI itself. Once installed do `p10k configure` and it will interactively prompt you to customize it as you want.

![P10k](/posts/awesome-cli-tools-2020/p10k.png)

Some of my favourite features here are:

* **Instant Prompt**: It provides you with an interactive prompt before finish loading the shell configuration itself, this makes it super fast to startup.
* **Show On Command**: It displays command related info (e.g. the kubernetes context & namespace). I have as alias `k` for `kubectl` so it appears the moment I strike `k` on my keyboard:

![ShowOnCommand](/posts/awesome-cli-tools-2020/show-on-command.gif "show on command the kubernetes context and namespace")

* Installation: `brew install p10k; p10k configure`
* Alternatives: [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh)

## 6. Meslo Nerd Font

P10k prompts if you want automatic installation of `Meslo Nerd Font` during `p10k configure` process. As a console font is good enough for me, so I'm sticking with that one.

* Installation: `p10k configure` 
* Alternatives: [Fira Code](https://github.com/tonsky/FiraCode), [Incosolata](https://fonts.google.com/specimen/Inconsolata), [Victor Mono](https://rubjo.github.io/victor-mono/)
 
## 7. z

Z is one of those small tools that really make a difference! Its description is "jump around" and is used as a direct replacement of `cd` to switch directories.

Instead of jumping by using absolute or relative paths between directories, it tracks your most frequent paths and jumps to the best match. So instead of doing for example `cd ~/src/private/harbur/docs/playbook` I simply do `z play` and it picks it up.

![Z](/posts/awesome-cli-tools-2020/z.gif "z - jump around")

* Installation: `brew install z`

## 8. Kubectl

Cloud native is almost synonym these days with kubernetes, so kubectl on the CLI is a must. There are different ways to install the binary, for the sake of uniformity we'll install it with brew.

* Installation: `brew install kubernetes-cli`

## 9. Minikube

Either if you're starting out or you're an experienced user of kubernetes one of the best ways to start a Kubernetes cluster locally is using [minikube](https://github.com/kubernetes/minikube).

![Minikube](/posts/awesome-cli-tools-2020/minikube.gif "starting kubernetes cluster with minikube locally")

* Installation: `brew install minikube`

## 9. kubectx

If you work with many clusters or many namespaces it s(h)aves a loooot of time to avoid passing those as parameters to each command, instead you can switch your active context or namespace to be the one you want to use.

For that you can use [kubectx](https://github.com/ahmetb/kubectx). It installs both `kubectx` and `kubens` for switching context or namespace respectively, combined with the "Show on command" feature of p10k at the right side of the screen it really shines:

![Kubectx](/posts/awesome-cli-tools-2020/kubectx.gif "switching kubernetes context fast with kubectx")

![Kubens](/posts/awesome-cli-tools-2020/kubens.gif "switching kubernetes namespace fast with kubens")

* Installation: `brew install kubectx`

## 10. Helm

[Helm](https://helm.sh/) is a package manager for kubernetes, it helps you organize multiple resources and install them together as a unified app, it also manages the lifecycle of the releases providing the ability to do upgrades and rollbacks.

![Helm](/posts/awesome-cli-tools-2020/helm.gif "listing helm releases on cert-manager namespace")

Make sure to use v3, as helm v2 has reached its end-of-life.

* Installation: `brew install helm`

## 11. Stern

[Stern](https://github.com/wercker/stern) is a multi pod and container log tailing for Kubernetes, so for example if you want to get the logs of a deployment with two pods you simply do `stern nginx` and it will tail the logs of both pods on screen:

![Stern](/posts/awesome-cli-tools-2020/stern.gif "using stern to tail logs of multiple pods")

* Installation `brew install stern`
* Alternatives: [kubetail](https://github.com/johanhaleby/kubetail), [kail](https://github.com/boz/kail)

## 12. Kubernetic Desktop client

[Kubernetic](http://kubernetic.com/) is a desktop client for kubernetes focused on productivity. While CLI is great for productivity and automation when needed, Kubernetic is best for feature discoverability, provides a great learning platform for newcomers, and is actually faster than working with the CLI for experienced users.

With Kubernetic you can manage multiple contexts & namespaces, see resources usage consumption, do port-forwarding of services, execute commands in containers, craft resources without extensive YAML knowledge and much much more.

![Kubernetic](/posts/awesome-cli-tools-2020/kubernetic.gif "create an nginx deployment with 2 replicas and do port-forward with Kubernetic")

* Installation: `brew install kubernetic`
* Disclaimer: Kubernetic is a product of Harbur Cloud Solutions, the consulting company where I currently work.
