const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,
  publicPath: './',
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://192.168.2.206:8090/pu/',
        target: 'https://dls.crrcgc.cc/pms',
        changeOrigin: true,
        pathRewrite: {
            '^/api': '',
        },
      },
    },
  }
})
