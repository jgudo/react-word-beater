const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const path = require('path');
const fs = require('fs');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = (env) => {
  const CSSExtract = new ExtractTextPlugin('app.css');
  const isProduction = env === 'production';
  
  return {
    entry: ['@babel/polyfill', './src/client/index.js'],
    output: {
      path: path.join(__dirname, 'public/assets'),
      filename: 'app.bundle.js'
    },
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }, {
        test: /\.s?css$/,
        use: CSSExtract.extract({
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }]
        })
      }]
    },
    resolve: {
      modules: [
        path.resolve('./src'),
        path.resolve('./node_modules')
      ],
      extensions: ['*', '.js', '.jsx']
    },
    plugins: [
      new ManifestPlugin({
        fileName: 'asset-manifest.json'
      }),
      new SWPrecacheWebpackPlugin({
        cacheId: 'word-beater',
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: 'service-worker.js',
        minify: true,
        navigateFallback: '/index.html',
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
      }),
      CSSExtract
    ],
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      publicPath: '/assets/',
      historyApiFallback: true,
      setup: (app) => {
        app.get('/service-worker.js', (req, res) => {
          res.set({ 'Content-Type': 'application/javascript; charset=utf-8' });
          res.send(fs.readFileSync('build/service-worker.js'));
        });
      }
    }
  };
};
