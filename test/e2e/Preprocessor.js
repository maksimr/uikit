const webpack = require('webpack');
module.exports = {
  'preprocessor:webpack': ['factory', function( /* config.basePath */ basePath) {
    const path = require('path');
    const config = require('../../webpack.config')();
    const tmpdir = require('os').tmpdir();
    return (content, file, done) => {
      const relativePath = path.relative(basePath, file.path);
      const output = require('path').join(tmpdir, relativePath);
      const wc = Object.assign({ mode: 'development', devtool: 'eval-source-map' }, config, {
        entry: file.path,
        output: {
          path: path.dirname(output),
          filename: path.basename(output)
        }
      });
      webpack(wc, (err) => {
        return err ? done(err) : require('fs').readFile(output, (err, content) => {
          done(err, content && content.toString());
        });
      });
    };
  }]
};