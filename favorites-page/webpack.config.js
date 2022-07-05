const { ModuleFederationPlugin } = require('webpack').container
const { dependencies } = require('./package.json')

const webpackConfigPath = 'react-scripts/config/webpack.config'
const webpackConfig = require(webpackConfigPath)

const override = (config) => {
  config.plugins.push(
    new ModuleFederationPlugin({
      name: 'favoritesPage',
      filename: 'remoteEntry.js',
      remotes: {
        listingPage: 'listingPage@http://localhost:3002/remoteEntry.js',
        remote: 'remote@http://localhost:3001/remoteEntry.js',
      },
      exposes: {
        './favoritesRoute': './src/route',
      },
      shared: {
        ...dependencies,
        react: {
          singleton: true,
          eager: true,
          requiredVersion: dependencies['react'],
        },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: dependencies['react-dom'],
        },
      },
    })
  )

  config.output.publicPath = 'auto'

  config.resolve = {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }

  return config
}

require.cache[require.resolve(webpackConfigPath)].exports = (env) => override(webpackConfig(env))

module.exports = require(webpackConfigPath)
