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
$ npm i webpack webpack-dev-server istanbul-instrumenter-loader babel-loader --save-dev
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
$ npm i babel-core babel-istanbul babel-istanbul-loader babel-plugin-transform-object-rest-spread babel-polyfill babel-preset-latest babel-register --save-dev
$ touch .babelrc
```

`.babelrc` file content:

```javascript
{
  "presets": ["latest"],
  "plugins": ["transform-object-rest-spread"]
}
```

## React

```
$ npm i react react-dom redux react-redux --save
```

## ESLint

```
$ npm i eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
$ touch .eslintignore
$ touch .eslintrc
```

`.eslintignore` file content:

```
node_modules/
artifacts/
docs/
dist/
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
    "max-len": [2, 100, 4, {"ignoreComments": true}]
  }
}
```

## Testing

```
$ npm i mocha chai sinon enzyme react-addons-test-utils --save-dev
```

## Karma

```
$ npm i karma karma-chai karma-coverage-istanbul-reporter karma-mocha karma-phantomjs-launcher karma-sourcemap-loader karma-spec-reporter karma-tap-reporter karma-webpack yargs --save-dev
$ touch karma.config.js
```

`karma.config.js` file content:

```javascript
var argv = require('yargs').argv;
var path = require('path');
var webpack = require('./webpack.config.js');

module.exports = function(config) {
  config.set({
    // only use PhantomJS for our 'test' browser
    browsers: ['PhantomJS'],

    // just run once by default unless --watch flag is passed
    singleRun: !argv.watch,

    // which karma frameworks do we want integrated
    frameworks: ['mocha', 'chai'],

    // displays tests in a nice readable format
    reporters: ['spec', 'coverage-istanbul', 'tap'],

    // include some polyfills for babel and phantomjs
    files: [
      'node_modules/babel-polyfill/browser.js',
      './test/**/*.js' // specify files to watch for tests
    ],
    preprocessors: {
      // these files we want to be precompiled with webpack
      // also run tests throug sourcemap for easier debugging
      ['./test/**/*.js']: ['webpack', 'sourcemap']
    },
    coverageIstanbulReporter: {
      // reports can be any that are listed here: https://github.com/istanbuljs/istanbul-reports/tree/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib
      reports: ['lcov', 'text-summary'],
      // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
      dir: path.join(__dirname, 'artifacts/coverage'),
      // if using webpack and pre-loaders, work around webpack breaking the source path
      fixWebpackSourcePaths: true,
      // stop istanbul outputting messages like `File [${filename}] ignored, nothing could be mapped`
      skipFilesWithNoCoverage: true,
    },
    tapReporter: {
      outputFile: 'artifacts/test/results.tap',
      disableStdout: true
    },
    // A lot of people will reuse the same webpack config that they use
    // in development for karma but remove any production plugins like UglifyJS etc.
    // I chose to just re-write the config so readers can see what it needs to have
    webpack: webpack,
    webpackMiddleware: {
      noInfo: true
    },
    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-webpack',
      'karma-phantomjs-launcher',
      'karma-spec-reporter',
      'karma-sourcemap-loader',
      'karma-coverage-istanbul-reporter',
      'karma-tap-reporter'
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
