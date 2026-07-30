
---

# Project Overview

We'll build this over three phases.

```text
learning-monorepo/

Phase 1
├── shared/
└── app/

↓

Phase 2
├── shared/
├── app1/
└── app2/

↓

Phase 3
├── apps/
│   ├── app1/
│   └── app2/
├── packages/
│   └── shared/
└── package.json
```

---

# Phase 1 — Learn Symlinks

## Step 1: Create the folders

```bash
mkdir learning-monorepo
cd learning-monorepo

mkdir shared
mkdir app
```

Verify:

```bash
tree
```

Expected:

```text
.
├── app
└── shared
```

---

## Step 2: Create a shared module

Create `shared/logger.js`

```javascript
module.exports = {
  log(message) {
    console.log("[LOGGER]", message);
  }
};
```

---

## Step 3: Create your app

Create `app/index.js`

```javascript
const logger = require("./logger");

logger.log("Hello");
```

Run:

```bash
node index.js
```

It should fail:

```text
Cannot find module './logger'
```

Good.

Why?

Because the file doesn't exist inside `app`.

---

## Step 4: Copy it manually

```bash
cp ../shared/logger.js .
```

Now inside `app`:

```text
app/
    index.js
    logger.js
```

Run:

```bash
node index.js
```

Output:

```text
[LOGGER] Hello
```

Works.

---

## Step 5: Experience the problem

Now modify

```javascript
shared/logger.js
```

```javascript
module.exports = {
  log(message) {
    console.log("[UPDATED LOGGER]", message);
  }
};
```

Run again.

Still prints

```text
[LOGGER]
```

Why?

Because you copied the file.

You now have two versions.

This is exactly the problem monorepos try to solve.

---

# Phase 2 — Linux Solves It

Delete the copied file.

```bash
rm app/logger.js
```

---

## Step 6: Create a symbolic link

Go inside app.

```bash
cd app
```

Create:

```bash
ln -s ../shared/logger.js logger.js
```

List files:

```bash
ls -l
```

You'll see something like:

```text
logger.js -> ../shared/logger.js
```

That arrow (`->`) is the key.

`logger.js` isn't a real file. It's just a pointer.

---

## Step 7: Run again

```bash
node index.js
```

Output:

```text
[UPDATED LOGGER] Hello
```

No copy happened.

Both point to the same file.

---

## Step 8: Change the shared file again

Edit:

```javascript
module.exports = {
  log(message) {
    console.log("[SYMLINK WORKS]", message);
  }
};
```

Run:

```bash
node index.js
```

Output:

```text
[SYMLINK WORKS] Hello
```

Now you've experienced why symlinks are useful.

---

# Phase 2.5 — Investigate the Filesystem

Run:

```bash
ls -l
```

Notice:

```text
logger.js -> ../shared/logger.js
```

Now try:

```bash
cat logger.js
```

It shows the file contents.

Even though `logger.js` isn't a separate file.

---

Run:

```bash
readlink logger.js
```

Output:

```text
../shared/logger.js
```

---

Run:

```bash
realpath logger.js
```

You'll see the absolute path.

---

Run:

```bash
stat logger.js
```

Notice that it's a symbolic link.

---

# Challenge 1

Create another app.

```bash
mkdir ../app2
```

Create:

```javascript
const logger = require("./logger");

logger.log("From App2");
```

Don't copy the logger.

Create another symlink.

Now both apps use the same logger.

This is your first manually managed shared library.

---

# Phase 3 — Let npm Do the Linking

Now you'll discover that npm is basically creating these links for you.

---

## Step 1: Create the structure

```text
learning-monorepo/

apps/
    app1/

packages/
    shared/
```

Move your files:

```text
packages/shared/logger.js

apps/app1/index.js
```

---

## Step 2: Create root package

```bash
npm init -y
```

Open `package.json`.

Replace with:

```json
{
  "name": "learning-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

---

## Step 3: Create package.json inside shared

```bash
cd packages/shared

npm init -y
```

Edit it:

```json
{
  "name": "shared",
  "version": "1.0.0",
  "main": "logger.js"
}
```

The `"name"` field is important—it becomes the package name you'll import.

---

## Step 4: Create package.json inside app1

```bash
cd ../../apps/app1

npm init -y
```

Edit:

```json
{
  "name": "app1",
  "version": "1.0.0",
  "dependencies": {
    "shared": "*"
  }
}
```

---

## Step 5: Install

Go back to the root.

```bash
cd ../../

npm install
```

Now inspect:

```bash
ls -l node_modules
```

You should see something like:

```text
app1 -> ../apps/app1
shared -> ../packages/shared
```

**You didn't create those symlinks. npm did.**

---

## Step 6: Use the shared package

In `apps/app1/index.js`:

```javascript
const logger = require("shared");

logger.log("Hello from workspace");
```

Run:

```bash
node apps/app1/index.js
```

Output:

```text
[SYMLINK WORKS] Hello from workspace
```

---

# What you just learned

| Phase | What you learned                                                                 |
| ----- | -------------------------------------------------------------------------------- |
| 1     | Copying code creates maintenance problems.                                       |
| 2     | Symbolic links let multiple projects share the same files.                       |
| 3     | npm Workspaces automatically creates and manages those links for local packages. |

Notice the progression:

```text
Copy files
      ↓
Create symlinks yourself
      ↓
Let npm generate symlinks automatically
      ↓
(Next) Understand how npm decides where dependencies like lodash are installed (hoisting)
      ↓
(Then) Learn how Turborepo orchestrates tasks on top of the workspace
```
