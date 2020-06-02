# DEV

## CLA Local Development

Copyright The Linux Foundation and each contributor to CommunityBridge.

SPDX-License-Identifier: CC-BY-4.0

## Prerequisites

- Node 12+
- Angular CLI

## The Forking Workflow
 Select Project
 Fork Project into your own repository (from the UI)
 Clone the project from forked repository (command line).

 Create `upstream` remote reference
    - Example: `git remote add upstream git@github.com:communitybridge/easycla-contributor-console.git`.
    The first time Pull in the latest reference from the upstream
    - Example: `git fetch upstream`
    Rebase and fix any merge conflicts
    - Example: `git rebase upstream/master`

## Angular project setup (Frontend) and essential commands
Yarn is available for Windows, Linux and MacOS. Once you have successfully installed Yarn. (You can test by running the command below, it will give you the yarn version number)

`yarn -v`


Install angualar CLI

`yarn global add @angular/cli`


Install dependencies:

`yarn install`


Run Angular Project 

`yarn serve`


Run ES Lint 

`yarn run eslint`


To install packages using Yarn is rather simple. Find or take any NPM package name and add it using yarn add command as indicated below:

`yarn add package-name-1 package-name-2 …`


Removing a dependency
`yarn remove [package]`


Create a new module

`ng g m <path>`


Create a new component

`ng g c <path>`


Create a new service

`ng g s <path>`


Create a local build

`ng build` or `yarn build`

Create a production build

`ng build --prod` or `yarn build --prod`
