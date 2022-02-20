async function main() {
  const { writeFile, readFile, readdir, lstat } = require('fs/promises');
  const { name: pkgName } = require('../package.json');
  const [inputDir, outputDir = 'dist'] = process.argv.slice(2);
  const bundlePath = require('path').join(outputDir, 'index.d.ts');

  const types = await findTypeFiles();
  const typesBundle = await bundleTypes(types);
  await writeFile(bundlePath, typesBundle);

  global.console.log('Types successfully bundle');

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
    const code = await readFile(typeFile);
    const module = typeFile.replace(`${inputDir}/`, '').replace(/\.d\.ts$/, '');
    const processedCode = code.toString()
      .replace(/(import\(["|'])([^"']+)(["|']\))/g, fixLocalDependencyPath)
      .replace(/(\s+from\s+["|'])([^"']+)(["|'];)/g, fixLocalDependencyPath);
    return `declare module "${pkgName}/${module}" {\n${processedCode}}`;

    /**
     * @param {string} _ 
     * @param {string} prefix 
     * @param {string} modulePath 
     * @param {string} postfix 
     * @returns {string}
     */
    function fixLocalDependencyPath(_, prefix, modulePath, postfix) {
      if (/^(\.|\/)/.test(modulePath)) {
        const moduleDir = require('path').dirname(module);
        const relModulePath = require('path').join(moduleDir, modulePath);
        return `${prefix}${pkgName}/${relModulePath}${postfix}`;
      }
      return _;
    }
  }

  /**
   * @param {string} dir
   * @param {RegExp} filter
   * @returns {Promise<string[]>}
   */
  async function readdirRecursive(dir, filter) {
    const dirFiles = await readdir(dir);
    const allFiles = await Promise.all(dirFiles.map(async (fileName) => {
      const path = require('path').join(dir, fileName);
      const isDirectory = (await lstat(path)).isDirectory();
      return isDirectory ? readdirRecursive(path, filter) : path;
    }));
    return allFiles.flat(1).filter((it) => filter.test(it));
  }
};

module.exports = main;
if (require.main === module) {
  main();
}