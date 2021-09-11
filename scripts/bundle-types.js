/**
 * Bundle provided d.ts files into one bundle
 * to support auto-import in VSCode and 
 * other VSCode like editors
 */
async function main() {
  const fs = require('fs').promises;
  const { name: pkgName } = require('../package.json');
  const argv = process.argv.slice(2);
  const inputDir = argv[0];
  const outputDir = argv[1] ?? 'dist';
  const bundlePath = require('path').join(outputDir, 'index.d.ts');

  const types = await findTypeFiles();
  const typesBundle = await bundleTypes(types);
  await fs.writeFile(bundlePath, typesBundle);

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
    const code = await fs.readFile(typeFile);
    const module = typeFile.replace(`${inputDir}/`, '').replace(/\.d\.ts$/, '');
    return `declare module "${pkgName}/${module}" {\n${code}}`;
  }

  /**
   * @param {string} dir 
   * @param {RegExp} filter 
   * @returns {Promise<string[]>}
   */
  async function readdir(dir, filter) {
    const dirFiles = await fs.readdir(dir);
    const allFiles = await Promise.all(dirFiles.map(async (fileName) => {
      const path = require('path').join(dir, fileName);
      const isDirectory = (await fs.lstat(path)).isDirectory();
      return isDirectory ? readdir(path, filter) : path;
    }));
    return allFiles.flat(1).filter((it) => filter.test(it));
  }
}

main();