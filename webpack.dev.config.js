const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const baseConfig = require('./webpack.config');

const [, ...otherRules] = baseConfig.module.rules;

module.exports = {
  ...baseConfig,
  devServer: {
    historyApiFallback: true,
  },
  entry: {
    main: [
      'webpack-hot-middleware/client',
      baseConfig.entry,
    ],
  },
  mode: 'development',
  module: {
    ...baseConfig.module,
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['react-refresh/babel']
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          }
        ],
      },
      ...otherRules,
    ],
  },
  output: {
    ...baseConfig.output,
    path: path.resolve(__dirname, 'server', 'src', 'public'),
  },
  plugins: [
    ...baseConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshPlugin({
      overlay: {
        sockIntegration: 'whm'
      }
    })
  ],
};
