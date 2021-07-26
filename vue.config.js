const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i

// function getPlugins() {
//   let plugins = []
//   plugins.push(
//     // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
//     // new UglifyJsPlugin({
//     //   uglifyOptions: {
//     //     compress: {
//     //       drop_debugger: true,
//     //       drop_console: true,
//     //     },
//     //   },
//     //   sourceMap: false,
//     //   parallel: true,
//     // }),
//     // 配置compression-webpack-plugin压缩
//     new CompressionWebpackPlugin({
//       asset: '[path].gz[query]',
//       algorithm: 'gzip',
//       test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
//       threshold: 10240,
//       minRatio: 0.8,
//     })
//   )
// }
function resolve(dir) {
  return path.join(__dirname, dir)
}
const devServer = {
  port: '8080',
  disableHostCheck: true,
  open: true,
  proxy: {
    // detail: https://cli.vuejs.org/config/#devserver-proxy
    [process.env.VUE_APP_BASE_API]: {
      // target: `http://127.0.0.1:${port}`,
      // target: "http://114.96.104.203:9000",
      target: 'http://114.96.104.203:9000',
      changeOrigin: true,
      pathRewrite: {
        ['^' + process.env.VUE_APP_BASE_API]: '',
      },
    },
  },
}

module.exports = {
  publicPath: './',
  lintOnSave: true,
  devServer,
  outputDir: './dist', // 运行时生成的生产环境构建文件的目录(默认''dist''，构建之前会被清除)
  productionSourceMap: false, // 生产打包时不输出map文件，增加打包速度

  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs =
        ['console.log']
    }
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin').use(
        new CompressionPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: true,
        })
      )
    }
    config.resolve.alias
      .set('assets', resolve('./src/assets'))
      .set('views', resolve('./src/views'))
      .set('store', resolve('./src/store'))
      .set('utils', resolve('./src/utils'))
    // 移除 prefetch 插件
    // config.plugins.delete('prefetch')
    // 移除 preload 插件
    // config.plugins.delete('preload');
  },
}
