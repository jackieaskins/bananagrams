const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
  entry: {
    main: [
      isDevelopment &&
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      './client/src/index',
    ].filter(Boolean),
  },
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            getCustomTransformers: () => ({
              before: [isDevelopment && ReactRefreshTypeScript()].filter(
                Boolean
              ),
            }),
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: isDevelopment
      ? path.resolve(__dirname, 'server', 'src', 'public')
      : path.resolve(__dirname, 'dist', 'public'),
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './client/src/index.html' }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: { fs: false },
  },
};
