module.exports = {
    // 是否为生产环境构建生成 source map
    productionSourceMap: false,

    // CSS 相关选项
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/assets/css/variables.scss";`
            }
        }
    },

    // 分析插件
    chainWebpack: config => {
        if (process.env.npm_config_report) {
            config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        }
    },

    // 配置 webpack-dev-server 行为
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8082,
        // https: true,
        https: false,
        proxy: {
            '/api': {
                // target: 'http://www.dbxyyxt.com/api',
                // target: 'http://192.168.1.5:8080',
                // target: 'http://localhost:8002',
                target: 'http://129.204.183.7:17018',
                changeOrigin: true,
                ws: true
                // pathRewrite: {
                //   '^/api': ''
                // }
            }
        }
    }
}
