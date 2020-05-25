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
Install the CLI using the npm package manager:

`npm install -g @angular/cli`


Install dependencies:

`npm install`


Run Angular Project 

`ng s` or `ng serve`

Run ES Lint 

`npm run eslint`


Create a new module

`ng g m <path>`


Create a new component

`ng g c <path>`


Create a new service

`ng g s <path>`


Create a local build

`ng build`

Create a production build

`ng build --prod`
