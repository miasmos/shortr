var webpack = require('webpack'),
    path = require('path'),
    autoprefixer = require('autoprefixer'),
    precss = require('precss')

module.exports = {
  entry: [
    './app/js/index.js'
  ],
  resolve: {
    alias: {
      joi: 'joi-browser'
    }
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  output: {
    path: path.resolve(__dirname, '../server/dist/static/js'),
    filename: "index.compiled.js"
  },
  module: {
    devtool: "source-map", // or "inline-source-map"
    loaders: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /joi-browser/],
        include: [path.resolve(__dirname, 'app'), path.resolve(__dirname, '../core')],
        loader: "babel-loader",
        query: {
            presets: ['react', 'es2015', 'stage-0']
        }
      },
      {
        test: /\.scss$/,
        loader: "style-loader!css-loader!postcss-loader!sass-loader?sourceMap"
      },
      {
        test: /\.jpg|.jpeg|.png|.gif$/,
        loader: "file?name=images/[name].[ext]"
      },
      {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'file?name=fonts/[name].[ext]'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ],
    sassLoader: {
      includePaths: [path.resolve(__dirname, "./app/index.scss")]
    }
  },
  postcss: function () {
      return [precss, autoprefixer];
  }
}