import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader';
import { join } from 'path';
import { Configuration, Resolve, Output, NewModule as Module, NamedModulesPlugin } from 'webpack';

export default <Configuration>{
  devtool: 'inline-source-map',
  entry: join(__dirname, 'src/index'),
  output: <Output>{
    path: join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: <Resolve>{
    extensions: ['.js', '.ts', '.tsx']
  },
  module: <Module>{
    rules: [
      {
        test: /\.ts$/,
        loader: 'tslint-loader?emitErrors=false&failOnHint=false',
        exclude: /node_modules/,
        enforce: 'pre'
      }, {
        test: /\.tsx?$/,
        loaders: [
          'awesome-typescript-loader?silent=true'
        ],
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new TsConfigPathsPlugin(),
    new NamedModulesPlugin()
  ]
};
