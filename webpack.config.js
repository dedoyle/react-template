const { merge } = require('webpack-merge')
const commonConfig = require('./config/common.js')
const developmentConfig = require('./config/development.js')
const productionConfig = require('./config/production.js')

module.exports = (env) => {
  if (env.development) {
    process.env.BABEL_ENV = 'development'
    process.env.NODE_ENV = 'development'
    return merge(commonConfig, developmentConfig)
  }

  if (env.production) {
    process.env.BABEL_ENV = 'production'
    process.env.NODE_ENV = 'production'
    return merge(commonConfig, productionConfig)
  }

  throw new Error('No matching configuration was found!')
}
