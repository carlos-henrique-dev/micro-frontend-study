const { ModuleFederationPlugin } = require('webpack').container
const { dependencies } = require('./package.json')

const webpackConfigPath = 'react-scripts/config/webpack.config'
const webpackConfig = require(webpackConfigPath)

const override = (config) => {
  config.plugins.push(
    new ModuleFederationPlugin({
      name: 'listingPage',
      filename: 'remoteEntry.js',
      remotes: {
        remote: 'remote@http://localhost:3001/remoteEntry.js',
        favoritesPage: 'favoritesPage@http://localhost:3003/remoteEntry.js',
      },
      exposes: {
        './favorites': './src/data/favorites.ts',
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

  return config
}

require.cache[require.resolve(webpackConfigPath)].exports = (env) => override(webpackConfig(env))

module.exports = require(webpackConfigPath)
