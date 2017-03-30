# ReduxWebpack2

Setting up a React Redux project with Webpack 2.

## Project Setup

This configuration considers the following folder structure:

```
+ dist
  + index.html
+ src
  + index.jsx
+ test
```

## Base structure

```
$ mkdir dist
$ mkdir src
$ mkdir test
$ touch dist/index.html
```

`index.html` file content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <div id="root"></div>
  <script src="vendor.min.js"></script>
  <script src="index.min.js"></script>
</body>
</html>
```

## Webpack

```
$ npm init
$ npm i webpack webpack-dev-server --save-dev
$ touch webpack.config.js
$ touch .gitignore
```

`.gitignore` content:

```
node_modules/
.DS_Store
*.log
.idea
*.iml
```

## Babel

```
$ npm i babel-loader babel-core babel-preset-react babel-preset-latest --save-dev
$ touch .babelrc
```

`.babelrc` file content:

```javascript
{
  "presets": ["latest", "react"]
}
```

## React

```
$ npm i react react-dom redux react-redux --save
```

## ESLint

```
$ npm i eslint-config-airbnb eslint-plugin-react eslint eslint-plugin-import eslint-plugin-jsx-a11y --save-dev
$ touch .eslintignore
$ touch .eslintrc
```

`.eslintignore` file content:

```
node_modules/
dist/
test/
*.config.js
*.json
```

`.eslintrc` file content:

```javascript
{
  "extends": "airbnb",
  "env": {
    "browser": true
  },
  "rules": {
    "indent": [2, 4],
    "comma-dangle": "off",
    "no-plusplus": "off",
    "max-len": [2, 100, 4, {"ignoreComments": true}]
  }
}
```

## Testing

```
$ npm i mocha chai sinon babel-register enzyme react-addons-test-utils --save-dev
```

## Karma

```
$ npm i karma karma-chai karma-mocha karma-webpack karma-sourcemap-loader karma-phantomjs-launcher karma-spec-reporter yargs --save-dev
$ touch karma.config.js
```

`karma.config.js` file content:

```javascript
var argv = require('yargs').argv;
var path = require('path');

module.exports = function(config) {
  config.set({
    // only use PhantomJS for our 'test' browser
    browsers: ['PhantomJS'],

    // just run once by default unless --watch flag is passed
    singleRun: !argv.watch,

    // which karma frameworks do we want integrated
    frameworks: ['mocha', 'chai'],

    // displays tests in a nice readable format
    reporters: ['spec'],

    // include some polyfills for babel and phantomjs
    files: [
      // 'node_modules/babel-polyfill/dist/polyfill.js',
      // './node_modules/phantomjs-polyfill/bind-polyfill.js',
      './test/**/*.js' // specify files to watch for tests
    ],
    preprocessors: {
      // these files we want to be precompiled with webpack
      // also run tests throug sourcemap for easier debugging
      ['./test/**/*.js']: ['webpack', 'sourcemap']
    },
    // A lot of people will reuse the same webpack config that they use
    // in development for karma but remove any production plugins like UglifyJS etc.
    // I chose to just re-write the config so readers can see what it needs to have
    webpack: {
       devtool: 'inline-source-map',
       context: path.resolve(__dirname, './src'),
       resolve: {
        // required for enzyme to work properly
        alias: {
          'sinon': 'sinon/pkg/sinon'
        }
      },
      module: {
        rules: [
          {
            test: /\.js?$/,
            exclude: [/node_modules/],
            use: [{
              loader: 'babel-loader',
              options: {
                presets: ['latest', 'react']
              }
            }]
          }
        ]
      },
      // required for enzyme to work properly
      externals: {
        'jsdom': 'window',
        'cheerio': 'window',
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': 'window'
      },
    },
    webpackMiddleware: {
      noInfo: true
    },
    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-webpack',
      'karma-phantomjs-launcher',
      'karma-spec-reporter',
      'karma-sourcemap-loader'
    ]
  });
};
```

## Code splitting for CSS

```
$ npm i bootstrap --save
$ npm i css-loader extract-text-webpack-plugin file-loader url-loader --save-dev
```

## Running scripts

`script` section inside `package.json` file:
```javascript
"scripts": {
    "dev": "./node_modules/.bin/webpack-dev-server --port 3000 --devtool eval --progress --colors --hot --content-base dist",
    "build": "./node_modules/.bin/webpack -p",
    "test": "node_modules/.bin/karma start karma.config.js",
    "test:watch": "ynpm run test -- --watch",
    "lint": "eslint . --ext .js --ext .jsx"
},
```

## Final version of `webpack.config.js`

`webpack.config.js` file content:

```javascript
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
```
