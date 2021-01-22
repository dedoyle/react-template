const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isProd = process.env.NODE_ENV === 'production'
const rules = [
  {
    test: /\.tsx?$/,
    exclude: '/node_modules/',
    use: ['ts-loader'],
  },
  {
    test: /\.jsx?$/,
    use: ['babel-loader'],
    exclude: '/node_modules/',
  },
  {
    test: /\.less$/i,
    exclude: '/node_modules/',
    use: [
      !isProd ? 'style-loader' : MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
      'less-loader',
    ],
  },
  {
    test: /\.(html|htm)$/,
    loader: 'html-loader',
    exclude: '/node_modules/',
  },
  {
    test: /\.(png|jpe?g|gif)(\?.*)?$/,
    exclude: '/node_modules/',
    use: [
      {
        loader: 'url-loader',
        options: {
          esModule: false,
          limit: 4 * 1024,
          name: 'img/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  {
    test: /\.(svg)(\?.*)?$/,
    exclude: '/node_modules/',
    use: [
      {
        loader: 'url-loader',
        options: {
          name: 'img/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    exclude: '/node_modules/',
    loader: 'url-loader',
    options: {
      limit: 4 * 1024,
      name: '[name].[hash:8].[ext]',
      outputPath: 'media',
    },
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    exclude: '/node_modules/',
    loader: 'url-loader',
    options: {
      limit: 4 * 1024,
      name: '[name].[hash:8].[ext]',
      outputPath: 'font',
    },
  },
]

module.exports = rules
