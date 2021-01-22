const webpack = require('webpack')

const utils = require('./utils.js')

module.exports = {
  mode: 'development',
  output: {
    path: utils.resolve('../dist'),
    // 包名称
    filename: 'js/[name].js',
  },
  // 原始源代码（仅限行）
  devtool: 'cheap-module-source-map',
  devServer: {
    // contentBase: utils.resolve('../dist'),
    publicPath: '/', // 此路径下的打包文件可在浏览器中访问
    port: '3000',
    overlay: true, // 浏览器页面上显示错误
    open: true, // 自动打开浏览器
    stats: 'errors-only', //stats: "errors-only"表示只打印错误：
    historyApiFallback: false, // 404 会被替代为 index.html
    inline: true, // 内联模式，实时刷新
    hot: true, // 开启热更新
    compress: true, // gzip
    // proxy: {
    //   '/api': {
    //     target: 'https://example.com/',
    //     changeOrigin: true,
    //     pathRewrite: {},
    //   },
    // },
  },
  plugins: [
    //热更新
    new webpack.HotModuleReplacementPlugin(),
  ],
}
