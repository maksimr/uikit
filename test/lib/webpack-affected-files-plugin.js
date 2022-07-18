module.exports = class {
  apply( /**@type {import('webpack').Compiler}*/ compiler) {
    const name = 'WebpackAffectedFilesPlugin';
    const { ConcatSource } = require('webpack-sources');

    let firstRun = true;
    compiler.hooks.compilation.tap(name, (compilation) => {
      compilation.hooks.processAssets.tap({ name, stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE }, (assets) => {
        const reasons = ( /**@type {import('webpack').Module}*/ module) => Array.from(compilation.moduleGraph.getIncomingConnections(module));
        const moduleId = ( /**@type {import('webpack').Module}*/ module) => compilation.chunkGraph.getModuleId(module);
        const reasonToModule = ( /**@type {import('webpack').ModuleGraphConnection}*/ reason) => reason.originModule;
        const affected = (firstRun ? [
          /*
              Always run all tests on the first run because this is what a developer
              would expect as a default behaviour
              Without this flag we would run tests only for last affected changes
              because we use filesystem cache which persists between test starts
              */
        ] : Array.from(compilation.modules)).reduce((affected, module) => {
          const affectedModuleId = moduleId(module);
          if (compilation.builtModules.has(module) && !affected.has(affectedModuleId)) {
            affected.add(affectedModuleId);
            const queue = reasons(module).map(reasonToModule);
            while (queue.length) {
              const module = queue.shift();
              const reasonModuleId = module && moduleId(module);
              if (module && !affected.has(reasonModuleId)) {
                affected.add(reasonModuleId);
                // eslint-disable-next-line max-depth
                for (const reason of reasons(module)) {
                  queue.push(reasonToModule(reason));
                }
              }
            }
          }
          return affected;
        }, new Set());

        firstRun = false;
        const karmaWebpackManifest = JSON.stringify(Array.from(affected));
        for (const pathname in assets) {
          compilation.assets[pathname] = /**@type {import('webpack').sources.Source}*/(new ConcatSource(
            `this.karmaWebpackManifest = ${karmaWebpackManifest};`,
            '\n',
            /**@type {import('webpack-sources').Source}*/(compilation.assets[pathname])));
        }
      });
    });
  }
};
