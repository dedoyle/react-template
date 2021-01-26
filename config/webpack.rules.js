

const isEnvProduction = process.env.NODE_ENV === 'production'
const isEnvDevelopment = process.env.NODE_ENV === 'development'

const getStyleLoaders = (cssOptions, preProcessor) => {
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
      options: cssOptions,
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
        sourceMap: true,
      },
    })
  }
  return loaders
}

const rules = [
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
      // By default we support CSS Modules with the extension .module.css
      {
        test: /\.css$/,
        use: getStyleLoaders({
          modules: true,
          sourceMap: isEnvDevelopment,
          importLoaders: 1,
        }),
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      },
      {
        test: /\.less$/,
        exclude: '/node_modules/',
        use: getStyleLoaders(
          {
            modules: true,
            sourceMap: isEnvDevelopment,
            importLoaders: 2,
          },
          'less-loader'
        ),
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
]

module.exports = rules
