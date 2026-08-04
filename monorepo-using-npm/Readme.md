#  Question 1: when i use npm workspace how usually teams install internal packages

In a real-world team environment using npm workspaces, developers never run manual ln -s terminal commands or write custom linking scripts.
Instead, teams use the standard npm install command coupled with a specific flag or configuration to declare and link internal packages. [1] 
Here are the two ways teams handle this in production:
## Method 1: The Automated Manifest Approach (Best Practice)
This is how 95% of engineering teams manage internal dependencies. You explicitly declare the dependency in the application's configuration file, and let npm handle the wiring.

   1. Open your application file (apps/backend-apis/package.json).
   2. Add your internal package directly to the dependencies object using its exact package name and version:
   
   {
     "name": "backend-apis",
     "version": "1.0.0",
     "dependencies": {
       "@my-monorepo/logger": "^1.0.0"
     }
   }
   
   3. Go back to your project root directory in your terminal and run a clean install:
   
   npm install
   
   [2, 3, 4, 5] 

npm automatically crawls your workspaces map, realizes @my-monorepo/logger is a local package, and instantly generates the correct operating system symlinks in the background.
------------------------------
## Method 2: The Command Line Approach (Fast Add)
If a developer is working in their terminal and wants to quickly hook up an internal package without opening and editing files manually, npm provides a dedicated workspace syntax.
From your project root folder, run this command:

npm install @my-monorepo/logger --workspace=backend-apis

(Shortcut version: npm i @my-monorepo/logger -w backend-apis)
## What this single command does behind the scenes:

* It looks up the apps/backend-apis workspace folder.
* It automatically injects @my-monorepo/logger into that folder's package.json dependency array.
* It updates the main root package-lock.json ledger.
* It safely instantiates the symlink so your application can immediately use require('@my-monorepo/logger').

------------------------------
## Summary Checklist for Teams

* Declaring internal packages: Always use the official package name (e.g., @my-monorepo/logger), never local file system paths (like ../../packages/logger).
* Onboarding new engineers: When a new team member clones the repository, they simply run a single npm install at the root. The workspaces setup automatically configures all the cross-package symlinks for their specific operating system flawlessly. [6, 7] 


# Question 2: So "workspaces" keyword just tells npm where to look for packages and also when i switch inside a apps directory and tried to install the package but i got the below error why i am getting this error and also my `backend apis` service contains package json normal package json

// package json in `monorepo/apps/backend apis`
```json
{
  "name": "backend-apis",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

//Root package json
`monorepo/`
```json
{
  "name": "@ashwath/logger",
  "version": "1.0.0",
  "description": "when i use npm workspace how usually teams install internal packages",
  "main": "index.js",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "ashwath",
  "license": "ISC"
}
```

```bash
mono-repos/monorepo-using-npm/apps/backend-apis$ npm i @ashwath/logger
npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/@ashwath%2flogger - Not found
npm ERR! 404 
npm ERR! 404  '@ashwath/logger@*' is not in this registry.
npm ERR! 404 
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/ashwath/.npm/_logs/2026-08-03T17_24_22_171Z-debug-0.log
```


