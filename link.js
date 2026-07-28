const fs = require('fs');
const path = require('path');

// 1. Define source and target (Updated to point to backend-apis)
const sourceDir = path.resolve(__dirname, 'packages', 'logger');
const targetDir = path.resolve(__dirname, 'apps', 'backend-apis', 'node_modules', '@my-monorepo');
const symlinkPath = path.join(targetDir, 'logger');

// 2. Ensure the nested target directory structure exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 3. Clean up existing symlink if it exists
if (fs.existsSync(symlinkPath)) {
  fs.unlinkSync(symlinkPath);
}

// 4. Create the symlink
fs.symlinkSync(sourceDir, symlinkPath, 'junction');

console.log('Successfully symlinked @my-monorepo/logger -> apps/backend-apis/node_modules/@my-monorepo/logger');
