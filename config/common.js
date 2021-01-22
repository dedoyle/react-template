const webpack = require('webpack')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'

const rules = require('./webpack.rules.js')
const utils = require('./utils.js')

module.exports = {
  devtool: 'source-map',
  // 入口
  entry: utils.resolve('../src/pages/demo/index.js'),
  resolve: {
    // import 导入时别名，减少耗时的递归解析操作
    alias: {
      '@': utils.resolve('../src'),
      lodash: 'lodash-es',
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  module: {
    // 忽略大型的 library 可以提高构建性能
    noParse: /jquery/,
    rules: rules,
  },
  externals: {
    // 防止将某些 import 的包 (package) 打包到 bundle 中，
    // 而是在运行时 (runtime) 再去从外部获取这些扩展依赖
    jquery: 'window.jquery',
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/),
    new ESLintPlugin(),
    // 自动加载模块，无需 import 或 require
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new HtmlWebpackPlugin(
      Object.assign(
        {
          inject: true,
          template: utils.resolve('../public/index.html'),
        },
        isProd
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined
      )
    ),
  ],
}
