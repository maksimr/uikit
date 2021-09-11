async function main() {
  const { name: pkgName } = require('../package.json');
  const { promisify } = require('util');
  const argv = process.argv.slice(2);
  const inputDir = argv[0];
  const outputDir = argv[1] ?? 'dist';
  const bundlePath = require('path').join(outputDir, 'index.d.ts');

  const types = await findTypeFiles();
  const typesBundle = await bundleTypes(types);
  await promisify(require('fs').writeFile)(bundlePath, typesBundle);

  global.console.log('Types successfully bundle');
  return;

  async function findTypeFiles() {
    return await readdir(inputDir, /\.d\.ts$/);
  }

  /**
   * @param {string[]} types 
   * @returns {Promise<string>}
   */
  async function bundleTypes(types) {
    return (await Promise.all(types.map(dtsToModule))).join('\n');
  }

  /**
   * @param {string} typeFile 
   * @returns {Promise<string>}
   */
  async function dtsToModule(typeFile) {
    const code = await promisify(require('fs').readFile)(typeFile);
    const module = typeFile.replace(`${inputDir}/`, '').replace(/\.d\.ts$/, '');
    return `declare module "${pkgName}/${module}" {\n${code}}`;
  }

  /**
   * @param {string} dir 
   * @param {RegExp} filter 
   * @returns {Promise<string[]>}
   */
  async function readdir(dir, filter) {
    const dirFiles = await promisify(require('fs').readdir)(dir);
    const allFiles = await Promise.all(dirFiles.map(async (fileName) => {
      const path = require('path').join(dir, fileName);
      const isDirectory = (await promisify(require('fs').lstat)(path)).isDirectory();
      return isDirectory ? readdir(path, filter) : path;
    }));
    return allFiles.flat(1).filter((it) => filter.test(it));
  }
}

main();