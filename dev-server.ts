import * as WebpackDevServer from 'webpack-dev-server';
import * as webpack from 'webpack';
import { Compiler } from 'webpack';

import { devServerConfig, devConfig } from './dev-server-config';

const compiler: Compiler = webpack(devConfig);
const devServer: WebpackDevServer = new WebpackDevServer(compiler, devServerConfig);

devServer.listen(3000, 'localhost', err => {
    if (err) {
      console.log(err);
    }
    console.log('Listening at localhost:3000');
  }
);