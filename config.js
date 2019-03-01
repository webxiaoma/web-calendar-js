module.exports = {
    dev:{   // development
        assetsSubDir: 'static',
        assetsPublicPath: '',
        proxyTable: {},

        host: 'localhost',
        port: 9091,
        openBrowser: true, 
    },
    build:{  // production
       assetsRoot:'./lib',  // 打包目录
       assetsSubDir: 'static', // 静态资源
       assetsPublicPath:''  // 公共路径
    }
}