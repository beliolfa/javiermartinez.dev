---
title: Configuring a monorepo with Yarn Workspaces using shared components, GitHub actions, and Vercel deployment.
description: 'We have two apps. One for the web made with Nuxt and the other for desktop made with Electron. So far so good but once the development is quite advanced we started to notice that there were components that had been used in both projects. Last week we decided to merge those two projects into a unique monorepo.'
image: https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1950&amp;q=80
author: javier-martinez
category: misc
createdAt: 2021-05-30T11:34:23.282Z
---

In [Remate](https://remate.io/), We have two apps. One for the web made with [Nuxt](https://nuxtjs.org/) and the other for desktop made with [Electron](https://www.electronjs.org/). So far so good but once the development is quite advanced we started to notice that there were components that had been used in both projects. This also applies to the API endpoints and more stuff.

Last week we decided to merge those two projects into a unique monorepo. That way we could have shared components YAY! But, wait a moment, is that going to work just out of the box? Short answer: No. Long answer: Yes, with Yarn Workspaces.

## Yarn Workspaces

According to [Yarn docs](https://classic.yarnpkg.com/en/docs/workspaces/), Workspaces are
`a new way to set up your package architecture that’s available by default starting from Yarn 1.0. It allows you to setup multiple packages in such a way that you only need to run yarn install once to install all of them in a single pass.`

Awesome, so by default, we can have two projects and run `yarn install` on the root and yarn will take care of manage both project dependencies. Yarn is smart enough to not install twice repeated dependencies among projects.

For enabling workspaces you only have to create a `package.json` file in your repository root.
```json[package.json]
{
  "private": true,
  "workspaces": ["workspace-a", "workspace-b"]
}
```
Note that `private: true` is required. Workspaces are not meant to be published.

The next step is creating those two folders and putting a single `package.json` file inside of each workspace.
```json[workspace-a/package.json]
{
 "name": "workspace-a",
 "version": "1.0.0",

 "dependencies": {
   "cross-env": "5.0.5"
 },
 "scripts": {
   "test": "node test.js"
 }
}
```

```json[workspace-b/package.json]
{
 "name": "workspace-b",
 "version": "1.0.0",

 "dependencies": {
   "cross-env": "5.0.5",
   "core-js": "2.6.10"
 }
}
```

With that in place, you can now run `yarn install` on the root folder (or in the root of the workspace itself 😯) and all the dependencies will be installed in a unique root `node_modules` folder.

If you inspect that folder, you will see the dependencies but also two symlinks to the workspaces 🤯 which makes it extremely easy to share code between projects.

### Shared workspace
Knowing that yarn workspaces creates a symlink to each subfolder, as it were a node package, we can use it as a regular npm dependency.

Let’s create a shared workspace with two files on it. The first one will be the `package.json`
```json[shared/package.json]
{
 "name": "shared",
 "version": "1.0.0",
 "main": "index.js"
}
```
And the actual code to import later
```js[shared/index.js]
module.exports = {
 say: thing => {
   console.log(thing)
 }
}
```
If you want to use that piece of code on, let’s say, `workspace-a` you only have to require it as you always do.

```js[package-a/index.js]
const { say } = require('shared')

say('hi')
```

## Github Actions
Okay, that’s awesome but now, our GitHub actions that previously lived on the root of each project,  are not working anymore 🙂

Github expects a `.github/workflows` folder on the root of the repo. So let’s create an example workflow
```yml[.github/workflows/tests-a.yml]
name: Tests

on:
 pull_request:
   branches: [ main ]

jobs:
 Tests:
   runs-on: ubuntu-latest

   steps:
   - uses: actions/checkout@v2
   - name: Install dependencies
     run: yarn
   - name: Run test suite
     run: yarn test
```
Two things are wrong with that `regular` workflow:

1. It’s going to be executed on each PR, even when only `workflow-b` files are included.
2. It’s going to be executed on the root of the repo, not in the `workflow-a` folder

Let’s fix it.
```yml[.github/workflows/tests-a.yml]
name: Tests

on:
 pull_request:
   branches: [ main ]
   paths:
     - 'workspace-a/**'

defaults:
 run:
   working-directory: workspace-a

jobs:
 Tests:
   runs-on: ubuntu-latest

   steps:
   - uses: actions/checkout@v2
   - name: Install dependencies
     run: yarn
   - name: Run test suite
     run: yarn test
```
1. Adding the `on.pull_request.paths` setting we are telling Github that the action should be only executed when the PR contains, at least, one file on that specific path.
2. Adding the `defaults.run.working-directory` setting we are telling Github that all the `runs` commands on that workflow have to be executed on that specific path.

Tests are passing, we are ready to deploy.

## Vercel Deployment

We use [Vercel](https://vercel.com/) at [64 Robots](https://64robot.com/) so I am going to focus on this platform for now. Similar steps should be followed on other platforms like [Netlify](https://netlify.com/).

The idea here is to tell Vercel that use one specific subfolder of the monorepo for the deployment.

This is quite simple on Vercel. Just pick the subfolder when you are connecting the repository. Period.
![Vercel Deploy](https://user-images.githubusercontent.com/12644599/120103515-42f79b80-c150-11eb-9ff3-cb07055e34a3.png)

The tricky part would be not firing a deployment of the webapp when we merge stuff on the electron app, right?

This can be done on Vercel using `Settings > Git > Ignored Build Steps`.

Adding this line `git diff HEAD^ HEAD --quiet .`
![Ignored build steps](https://user-images.githubusercontent.com/12644599/120103568-83571980-c150-11eb-8439-909e5708edef.png)

That way, if the diff doesn’t contain any file on the working directory it would cancel the deployment like this
![Cancelled build](https://user-images.githubusercontent.com/12644599/120103595-a41f6f00-c150-11eb-8050-35832d044689.png)

And that's all! You now have a fully configured monorepo 🎉.

Check the code of this example out on [Github](https://github.com/beliolfa/monorepo-demo).

If this post helped you or your company, consider buying me a piece of cake in [Github Sponsors](https://github.com/sponsors/beliolfa). Thank You 🥰.