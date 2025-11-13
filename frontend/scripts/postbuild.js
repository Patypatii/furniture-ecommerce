/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', '.next', 'server', 'app');
const sourceFile = path.join(appDir, 'page_client-reference-manifest.js');
const routeGroupDir = path.join(appDir, '(shop)');
const targetFile = path.join(routeGroupDir, 'page_client-reference-manifest.js');

try {
  if (!fs.existsSync(sourceFile)) {
    console.warn(
      '[postbuild] Could not locate source client-reference manifest:',
      sourceFile,
    );
    process.exit(0);
  }

  if (!fs.existsSync(routeGroupDir)) {
    fs.mkdirSync(routeGroupDir, { recursive: true });
  }

  fs.copyFileSync(sourceFile, targetFile);
  console.log(
    '[postbuild] Copied client-reference manifest for (shop) route group.',
  );
} catch (error) {
  console.error('[postbuild] Failed to copy client-reference manifest.', error);
  process.exit(1);
}

