import path from 'path';
import NpmInstallPlugin from 'npm-install-webpack-plugin';

const config = {
  entry: {
    bundle: './src/index'
  },
  output: {
    path: './dist',
    filename: '[name].js'
  },
  debug: true,
  devtool: 'eval',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  plugins: [
    new NpmInstallPlugin()
  ]
};


module.exports = config;
