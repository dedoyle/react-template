const webpack = require('webpack')
const path = require('path')
// const TerserPlugin = require('terser-webpack-plugin')
const threadLoader = require('thread-loader')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const WorkboxPlugin = require('workbox-webpack-plugin')
const os = require('os')

const resolve = (dir) => path.resolve(__dirname, dir)

const jsWorkerPool = {
  workers: os.cpus().length,
  poolTimeout: 2000,
}

const cssWorkerPool = {
  workers: os.cpus().length,
  workerParallelJobs: 2,
  poolTimeout: 2000,
}

threadLoader.warmup(jsWorkerPool, ['babel-loader'])
threadLoader.warmup(cssWorkerPool, ['css-loader', 'postcss-loader'])

module.exports = {
  // 默认配置，无需写
  // entry: './src/index.js',
  output: {
    filename: '[name].[contenthash:8].js',
    path: resolve('dist'),
  },
  devtool: 'source-map', // 调试的时候可以快速找到错误代码
  resolve: {
    alias: {
      '@': resolve('src'),
      lodash: 'lodash-es',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: resolve('src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: jsWorkerPool,
          },
          'babel-loader',
        ],
      },
      {
        test: /.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'thread-loader',
            options: cssWorkerPool,
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(html)$/,
        loader: 'html-loader',
      },
      // 雪碧图阈值调整为 10kB
    ],
  },
  // optimization: {
  //   runtimeChunk: true,
  //   splitChunks: { chunks: 'all' },
  //   minimizer: [
  //     new TerserPlugin({
  //       parallel: true, // 多线程
  //       sourceMap: false, // Must be set to true if using source-maps in production
  //     }),
  //   ],
  // },
  plugins: [
    new ESLintPlugin(),
    new HtmlWebpackPlugin({ template: resolve('public/index.html') }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/),
    // new webpack.DllReferencePlugin({
    //   context: process.cwd(),
    //   manifest: require('./dist/vendor/vendorVue-manifest.json'),
    // }),
  ],
  devServer: { open: 'chrome' },
}
