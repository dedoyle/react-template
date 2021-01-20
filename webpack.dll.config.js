const path = require('path')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')

// dll文件存放的目录
const dllPath = 'public/vendor'

// const vendorVue = ['vue', 'vue-router', 'vuex', 'vuex-persistedstate']
const vendorReact = ['react', 'react-dom']

module.exports = {
  entry: {
    // 需要提取的库文件
    // vendorVue,
    vendorReact,
  },
  output: {
    path: path.join(__dirname, dllPath),
    filename: '[name].dll.js',
    // vendor.dll.js中暴露出的全局变量名
    // 保持与 webpack.DllPlugin 中名称一致
    library: '[name]_[hash]',
  },
  plugins: [
    // 清除之前的dll文件
    // new CleanWebpackPlugin(),
    // 设置环境变量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // manifest.json 描述动态链接库包含了哪些内容
    new webpack.DllPlugin({
      path: path.join(__dirname, dllPath, '[name]-manifest.json'),
      // 保持与 output.library 中名称一致
      name: '[name]_[hash]',
      context: process.cwd(),
    }),
    new CompressionPlugin({
      test: /\.(js|html|json|css)$/,
      threshold: 10240,
      deleteOriginalAssets: false,
    }),
  ],
}
