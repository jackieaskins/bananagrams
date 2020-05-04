const path = require('path');
const webpack = require('webpack');

const baseConfig = require('./webpack.config');

module.exports = {
  ...baseConfig,
  devServer: {
    historyApiFallback: true,
  },
  entry: {
    main: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      baseConfig.entry,
    ],
  },
  mode: 'development',
  output: {
    ...baseConfig.output,
    path: path.resolve(__dirname, 'server', 'src', 'public'),
  },
  plugins: [...baseConfig.plugins, new webpack.HotModuleReplacementPlugin()],
};
