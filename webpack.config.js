const { merge } = require('webpack-merge')

module.exports = (env) => {
  if (env.development) {
    process.env.BABEL_ENV = 'development'
    process.env.NODE_ENV = 'development'
    const commonConfig = require('./config/common.js')
    const developmentConfig = require('./config/development.js')
    return merge(commonConfig, developmentConfig)
  }

  if (env.production) {
    process.env.BABEL_ENV = 'production'
    process.env.NODE_ENV = 'production'
    const commonConfig = require('./config/common.js')
    const productionConfig = require('./config/production.js')
    return merge(commonConfig, productionConfig)
  }

  throw new Error('No matching configuration was found!')
}
