async function main() {
  const fs = require('fs').promises;
  const { name: pkgName } = require('../package.json');
  const [inputDir, outputDir = 'dist'] = process.argv.slice(2);
  const bundlePath = require('path').join(outputDir, 'index.d.ts');

  const types = await findTypeFiles();
  const typesBundle = await bundleTypes(types);
  await fs.writeFile(bundlePath, typesBundle);

  global.console.log('Types successfully bundle');
  return;

  async function findTypeFiles() {
    return await readdirRecursive(inputDir, /\.d\.ts$/);
  }

  /**
   * @param {string[]} types 
   * @returns {Promise<string>}
   */
  async function bundleTypes(types) {
    return (await Promise.all(types.map(wrapTypeInModule))).join('\n');
  }

  /**
   * @param {string} typeFile 
   * @returns {Promise<string>}
   */
  async function wrapTypeInModule(typeFile) {
    const code = await fs.readFile(typeFile);
    const module = typeFile.replace(`${inputDir}/`, '').replace(/\.d\.ts$/, '');
    return `declare module "${pkgName}/${module}" {\n${code}}`;
  }

  /**
   * @param {string} dir 
   * @param {RegExp} filter 
   * @returns {Promise<string[]>}
   */
  async function readdirRecursive(dir, filter) {
    const dirFiles = await fs.readdir(dir);
    const allFiles = await Promise.all(dirFiles.map(async (fileName) => {
      const path = require('path').join(dir, fileName);
      const isDirectory = (await fs.lstat(path)).isDirectory();
      return isDirectory ? readdirRecursive(path, filter) : path;
    }));
    return allFiles.flat(1).filter((it) => filter.test(it));
  }
}

main();