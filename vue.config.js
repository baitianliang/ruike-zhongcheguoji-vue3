const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,
  publicPath: './',
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        'opentype.js/dist/opentype.module.js': 'opentype.js/dist/opentype.mjs',
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://192.168.2.206:8090/pu/',
        // target: 'http://192.168.1.7:8090/pms',
        target: 'https://dls.crrcgc.cc/pms',
        changeOrigin: true,
        pathRewrite: {
            '^/api': '',
        },
      },
    },
  }
})
