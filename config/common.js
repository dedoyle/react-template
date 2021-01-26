const fs = require('fs')
const resolve = require('resolve')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpackDevClientEntry = require.resolve(
  'react-dev-utils/webpackHotDevClient'
)
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin')

const paths = require('./paths')
const utils = require('./utils.js')

const isEnvProduction = process.env.NODE_ENV === 'production'
const isEnvDevelopment = process.env.NODE_ENV === 'development'
// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig)
const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || 4 * 1024
)

const getStyleLoaders = (importLoaders, preProcessor) => {
  const loaders = [
    // style-loader 是将 css-loader 打包好的 CSS 代码以<style>标签的形式插入到 HTML
    isEnvDevelopment && require.resolve('style-loader'),
    // 将 CSS 以<link>的方式通过 URL 的方式插入 HTML
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      options: paths.publicUrlOrPath.startsWith('.')
        ? { publicPath: '../../' }
        : {},
    },
    {
      loader: require.resolve('css-loader'),
      options: {
        sourceMap: isEnvDevelopment,
        importLoaders,
        modules: {
          localIdentName: '[local]_[hash:base64:5]',
          // 回调必须返回 `local`，`global`，或者 `pure`
          mode: (resourcePath) => {
            if (/pure.css$/i.test(resourcePath)) {
              return 'pure'
            }

            if (/global.css$/i.test(resourcePath)) {
              return 'global'
            }

            return 'local'
          },
        },
      },
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
    },
  ].filter(Boolean)
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        javascriptEnabled: true,
        sourceMap: isEnvDevelopment,
      },
    })
  }
  return loaders
}

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false
  }

  try {
    require.resolve('react/jsx-runtime')
    return true
  } catch (e) {
    return false
  }
})()

module.exports = {
  // Stop compilation early in production
  bail: isEnvProduction,
  devtool: 'source-map',
  // 入口
  entry: isEnvDevelopment
    ? [webpackDevClientEntry, paths.appIndexJs]
    : paths.appIndexJs,
  resolve: {
    modules: ['node_modules', paths.appNodeModules],
    extensions: paths.moduleFileExtensions
      .map((ext) => `.${ext}`)
      .filter((ext) => useTypeScript || !ext.includes('ts')),
    // 减少耗时的递归解析操作
    alias: {
      '@': paths.appSrc,
      lodash: 'lodash-es',
    },
  },
  module: {
    // 忽略大型的 library 可以提高构建性能
    noParse: /jquery/,
    rules: [
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: imageInlineSizeLimit,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(js|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              customize: require.resolve(
                'babel-preset-react-app/webpack-overrides'
              ),
              presets: [
                [
                  require.resolve('babel-preset-react-app'),
                  {
                    runtime: hasJsxRuntime ? 'automatic' : 'classic',
                  },
                ],
              ],

              plugins: [
                // [
                //   require.resolve('babel-plugin-named-asset-import'),
                //   {
                //     loaderMap: {
                //       svg: {
                //         ReactComponent:
                //           '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                //       },
                //     },
                //   },
                // ],
                isEnvDevelopment && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              // See #6846 for context on why cacheCompression is disabled
              cacheCompression: false,
              compact: isEnvProduction,
            },
          },
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader turns CSS into JS modules that inject <style> tags.
          // In production, we use MiniCSSExtractPlugin to extract that CSS
          // to a file, but in development "style" loader enables hot editing
          // of CSS.
          {
            test: /\.css$/,
            exclude: '/node_modules/',
            use: getStyleLoaders(1),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
          },
          {
            test: /\.less$/,
            exclude: '/node_modules/',
            use: getStyleLoaders(2, 'less-loader'),
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
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            loader: require.resolve('file-loader'),
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  externals: {
    // 防止将某些 import 的包 (package) 打包到 bundle 中，
    // 而是在运行时 (runtime) 再去从外部获取这些扩展依赖
    jquery: 'window.jquery',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/),
    new CaseSensitivePathsPlugin(),
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
        isEnvProduction
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
    useTypeScript &&
      new ForkTsCheckerWebpackPlugin({
        typescript: resolve.sync('typescript', {
          basedir: paths.appNodeModules,
        }),
        async: isEnvDevelopment,
        checkSyntacticErrors: true,
        tsconfig: paths.appTsConfig,
        reportFiles: [
          // This one is specifically to match during CI tests,
          // as micromatch doesn't match
          // '../cra-template-typescript/template/src/App.tsx'
          // otherwise.
          '../**/src/**/*.{ts,tsx}',
          '**/src/**/*.{ts,tsx}',
          '!**/src/**/__tests__/**',
          '!**/src/**/?(*.)(spec|test).*',
          '!**/src/setupProxy.*',
          '!**/src/setupTests.*',
        ],
        silent: true,
        // The formatter is invoked directly in WebpackDevServerUtils during development
        formatter: isEnvProduction ? typescriptFormatter : undefined,
      }),
    new ESLintPlugin({
      // Plugin options
      extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
      formatter: require.resolve('react-dev-utils/eslintFormatter'),
      eslintPath: require.resolve('eslint'),
      context: paths.appSrc,
      cache: true,
      // ESLint class options
      cwd: paths.appPath,
      resolvePluginsRelativeTo: __dirname,
      baseConfig: {
        extends: [require.resolve('eslint-config-react-app/base')],
        rules: {
          ...(!hasJsxRuntime && {
            'react/react-in-jsx-scope': 'error',
          }),
        },
      },
    }),
  ].filter(Boolean),
}
