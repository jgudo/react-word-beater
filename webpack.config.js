const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const path = require('path');


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
      CSSExtract,
      new WorkboxPlugin.GenerateSW()
    ],
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      publicPath: '/assets/',
      historyApiFallback: true
    }
  };
};
