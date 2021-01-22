const webpack = require('webpack')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')

const utils = require('./utils.js')

module.exports = {
  mode: 'production',
  // 留空，none 打包后的代码
  devtool: 'none',
  output: {
    path: utils.resolve('../dist'),
    // 包名称
    filename: 'js/[name].[contenthash:8].js',
    // 块名，公共块名(非入口)
    chunkFilename: 'js/[name].[contenthash:8].js',
    // 打包生成的 index.html 文件里面引用资源的前缀
    // 也为发布到线上资源的 URL 前缀
    // 使用的是相对路径，默认为 ''
    publicPath: './',
  },
  optimization: {
    // 设置为 true, 一个chunk打包后就是一个文件，一个chunk对应`一些js css 图片`等
    runtimeChunk: true,
    // 默认 entry 的 chunk 不会被拆分, 配置成 all, 就可以了拆分了，一个入口`JS`
    splitChunks: { chunks: 'all' },
    chunkIds: 'deterministic',
    moduleIds: 'deterministic',
    minimizer: [
      new TerserPlugin({
        test: /\.jsx?$/i,
        parallel: true, // 多线程
      }),
    ],
  },
  plugins: [
    // 删除 dist 目录
    new CleanWebpackPlugin({
      // verbose Write logs to console.
      verbose: false, //开启在控制台输出信息
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
    }),
    new PurgecssPlugin({
      paths: utils.getPurecssPath('../src'),
    }),
    new CompressionPlugin({
      test: /\.(js|css)$/i,
      algorithm: 'gzip',
      threshold: 10240, // Byte
    }),
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(utils.resolve(
        '../public/vendor/vendorReact-manifest.json'
      )),
    }),
  ],
}
