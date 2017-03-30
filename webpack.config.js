const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    index: './index.jsx',
    vendor: ['react', 'react-dom']
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.js?/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['latest', 'react']
          }
        }]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      },
      {
        test: /\.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: '100000'
          }
        }
      },
      {
        test: /\.jpg$/,
        use: {
          loader: 'file-loader'
        }
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: '10000',
            mimetype: 'application/font-woff'
          }
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: '10000',
            mimetype: 'application/octet-stream'
          }
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: '10000',
            mimetype: 'image/svg+xml'
          }
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css')
  ]
};
