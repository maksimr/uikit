/**
 * Test that build script works correctly and put
 * all files from `lib` to `dist`. So the user
 * can require them without `lib` in path like `require('@maksimr/uikit/store')`
 */
function main() {
  const { execSync } = require('child_process');
  execSync('npm run build:pkg');

  const { strictEqual } = require('assert');
  const { existsSync } = require('fs');
  strictEqual(existsSync('dist/index.js'), true);
  strictEqual(existsSync('dist/package.json'), true);
  strictEqual(existsSync('dist/lib'), false);
}

main();