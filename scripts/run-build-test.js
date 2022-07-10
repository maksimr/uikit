function runTests() {
  const { execSync } = require('child_process');
  execSync('npm run build:pkg');

  /**
   * Test that build script works correctly and put
   * all files from `lib` to `dist`. So the user
   * can require them without `lib` in path like `require('@maksimr/uikit/store')`
   */
  const { strictEqual } = require('assert');
  const { existsSync } = require('fs');
  strictEqual(existsSync('dist/index.js'), true, 'should put files from lib folder to dist');
  strictEqual(existsSync('dist/package.json'), true, 'should create package.json in dist');
  strictEqual(existsSync('dist/lib'), false, 'should not create lib folder in dist');
}

runTests();