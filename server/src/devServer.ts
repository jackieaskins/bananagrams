import core from 'express-serve-static-core';
import path from 'path';

export const configureDevServer = (app: core.Express): void => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../../webpack.dev.config');
  /* eslint-enable @typescript-eslint/no-var-requires */
  const compiler = webpack(webpackConfig);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
    })
  );
  app.use(webpackHotMiddleware(compiler));

  app.use('*', (_, res, next) => {
    const filename = path.resolve(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err: any, result: any) => {
      if (err) {
        return next(err);
      }

      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  });
};
