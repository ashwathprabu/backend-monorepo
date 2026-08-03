
```
getting this issue-2$ ln -s ./packages/logger/index.js ./apps/backend-apis/logger/index.js
ln: failed to create symbolic link './apps/backend-apis/logger/index.js': No such file or directory
bumblebee:~/Documents/Projects/mono-repos/monorepo-2$ ls
apps  packages
bumblebee:~/Documents/Projects/mono-repos/monorepo-2$ 

getting this issue

```

### Answer
This error happens because the destination folder path ./apps/backend-apis/logger/ does not exist yet.
The ln -s command creates a link file, but it cannot automatically create missing folders along the way.
## The Fix
You need to create the destination folder structure first using mkdir -p before running your link command.
Run these two commands in order from your terminal:

# 1. Create the missing destination folders
mkdir -p ./apps/backend-apis/logger
# 2. Create the symbolic link
ln -s ./packages/logger/index.js ./apps/backend-apis/logger/index.js

## 💡 Two Crucial Tips for Manual Symlinking:

   1. Use Absolute Paths (Highly Recommended):
   Using relative paths (./) with ln -s can sometimes confuse Node.js when it tries to trace the link back. It is safer to use absolute paths by referencing your current directory structure:
   
   ln -s "$(pwd)/packages/logger/index.js" "$(pwd)/apps/backend-apis/logger/index.js"
   
   2. The Node.js Resolution Trap:
   By linking a specific file directly into your app's local code directory, you are bypassing the normal Node.js package lookup pipeline. To import it inside your app code, you will have to use a local file path relative to your application folder:
   
   // Inside apps/backend-apis/server.jsconst { log } = require('./logger/index.js'); 
----------------------