const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = (env, argv) => {

  const mode = env.mode || 'development';
  const isProduction = mode === 'production';

  return ({
    mode,
    entry: {
      main: path.resolve(__dirname, './src/js/index.js'),
    },
    output: isProduction
    ? {
      path: path.resolve(__dirname, './dist'),
      filename: 'js/[name].min.js',
      // 設定 library 的匯出方式 
      // export (ES module) 使用 module
      // module.exports (CommonJS) 使用 umd
      library: {
        type: 'module',
      }
    }
    : {
      path: path.resolve(__dirname, './dist'),
      filename: 'js/[name].dev.js',
    },
    // 需要開啟 outputModule 才可以匯出模組
    experiments: {
      outputModule: true
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader, 
            'css-loader', 
            'postcss-loader',
            'sass-loader'
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    "@babel/preset-env",
                    {
                      "useBuiltIns": "usage",
                      "corejs": 3
                    }
                  ]
                ],
                plugins: ["@babel/plugin-proposal-class-properties"]
              }

            }
         ]
        },

        // 將 fontawesome svg, woff...等檔案引入到
        {
          test: /\.(svg|eot|woff|woff2|ttf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[hash][ext][query]'
          }
       },
      ],
    },
    watch: true,
    devtool: 'source-map',
    plugins: [
      new CleanWebpackPlugin(),
      new Dotenv({
        path: `./.env.${ mode }`,
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
      }),

      // webpack 引入 jquery
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
     })
    ],

  })
};
