async function main() {
  const {writeFile} = require('fs/promises');
  const pkgPath = require.resolve('../dist/package.json');
  const pkg = require(pkgPath);
  const assert = require('assert');

  assert.ok(!pkg.type, 'package type should not be defined because we rewrite on "module"');

  pkg.type = 'module';

  writeFile(pkgPath, JSON.stringify(pkg, null, 2));
};

module.exports = main;
if (require.main === module) {
  main();
}
