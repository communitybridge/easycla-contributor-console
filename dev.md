# DEV

## CLA Local Development

## Prerequisites

- Node 12+
- Angular CLI

## The Forking Workflow

1. Select Project
1. Fork Project into your own repository (from the UI)
1. Clone the project from forked repository (command line).
1. Create `upstream` remote reference
   - Example: `git remote add upstream git@github.com:communitybridge/easycla-contributor-console.git`.
   The first time Pull in the latest reference from the upstream
   - Example: `git fetch upstream`
   Rebase and fix any merge conflicts
   - Example: `git rebase upstream/master`

## Angular project setup (Frontend) and essential commands

Yarn is available for Windows, Linux and MacOS. Once you have successfully
installed Yarn. (You can test by running the command below, it will give you the
yarn version number)

`yarn -v`

Install angualar CLI

`yarn global add @angular/cli`

### Install dependencies:

```bash
# Install the project dependencies
yarn install

# Install the edge dependencies
cd edge
yarn install
```

### Build The Project

```bash
# Build for dev environment
yarn build:dev

# Build the edge dependencies
cd edge
yarn build
```

### Run Angular Project 

```bash
yarn serve
```

### Run ES Lint 

```bash
yarn run eslint
```

## License

Copyright The Linux Foundation and each contributor to CommunityBridge.

This project’s source code is licensed under the MIT License. A copy of the license is available in LICENSE.

This project’s documentation is licensed under the Creative Commons Attribution 4.0 International License \(CC-BY-4.0\). A copy of the license is available in LICENSE-docs.

