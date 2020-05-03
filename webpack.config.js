const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => ({
  devServer: {
    historyApiFallback: true,
  },
  entry: './client/src/index',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
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
  node: {
    fs: 'empty',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist', 'public'),
    publicPath: '/',
  },
  plugins: [new HtmlWebpackPlugin({ template: './client/src/index.html' })],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
});
