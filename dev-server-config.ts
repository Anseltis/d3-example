import * as WebpackDevServer from 'webpack-dev-server';
import { Configuration } from 'webpack-dev-server';
import * as webpack from 'webpack';
import { HotModuleReplacementPlugin, NamedModulesPlugin } from 'webpack';
import { TsConfigPathsPlugin, CheckerPlugin } from 'awesome-typescript-loader';

import { default as config } from './webpack-config';

export const devServerConfig: Configuration = <Configuration>{
  port: 3000,
  publicPath: '/',
  contentBase: '.',
  hot: true,
  hotOnly: true,
  historyApiFallback: true,
  inline: true,
  compress: true,
  stats: { colors: true }
};

export const devConfig: webpack.Configuration = <webpack.Configuration>{
  ...config,
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
	  'webpack/hot/dev-server',
    config.entry
  ],
  devServer: {
    ...(config.devServer || {}),
    ...devServerConfig
  },
  plugins: [
    ...(config.plugins || []),
    new HotModuleReplacementPlugin()
  ]
};

export default <webpack.Configuration>{
	...devConfig,
	entry: [
		'webpack-dev-server/client?http://localhost:3000',
		'webpack/hot/only-dev-server',
		config.entry
	]
};