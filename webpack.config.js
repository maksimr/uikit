const ASSET_PATH = process.env.ASSET_PATH || '';

/**
 * @typedef {import('webpack').Configuration & {devServer?: import('webpack').WebpackOptionsNormalized['devServer']}} WebpackConfig
 * @returns {WebpackConfig}
 */
module.exports = () => ({
  output: {
    filename: '[name].[contenthash].js',
    publicPath: ASSET_PATH
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        loader: require.resolve('babel-loader')
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]'
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new (require('webpack').DefinePlugin)({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
    }),
    new (require('html-webpack-plugin'))({
      template: require.resolve('./index.html')
    })
  ],
  devServer: {
    allowedHosts: 'all'
  },
  stats: 'minimal',
  infrastructureLogging: {
    level: 'warn',
  }
});
