// vue.config.js
module.exports = {
  transpileDependencies: ['vuetify'],

  // Backend
  outputDir: 'C:/Users/sungmin/Documents/Github/RouletteBackend/demo/src/main/resources/static',

  // Proxy settings
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:9090', // Backend Server
        changeOrigin: true
      }
    }
  },

  configureWebpack: {
    // Webpack configuration options
  }
};
