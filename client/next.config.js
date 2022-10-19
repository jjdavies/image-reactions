const { StatsWriterPlugin } = require('webpack-stats-plugin');

module.exports = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.module.rules.push(
    //   {
    //   test:/\.atlas/,
    //   use: 'file-loader'
    // },
    // {
    //   test:/\.skel/,
    //   use: 'file-loader'
    // })
    {
    test: /\.(skel|atlas)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/chunks/[path][name].[hash][ext]'
      },
    },
    {
    test: /\skeleton.png/,
      type: 'asset/resource',
      generator: {
        filename: 'static/chunks/[path][name].[ext]'
      },
    },
    );
    config.plugins.push(
      new StatsWriterPlugin({
        filename:'../webpack-stats.json',
        stats:{
          assets: true,
          chunks: true,
          modules: true
        }
      })
    )
    return config
  },

  async rewrites() {
    return [
      {
        source: '/:image*',
        destination: 'http://localhost:5000/:image*',
      },
  ]}
}