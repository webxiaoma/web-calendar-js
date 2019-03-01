
const autoprefixer = require('autoprefixer');

module.exports = {
    plugins: [
      autoprefixer({
      // 配置要兼容的浏览器版本
      // 也可以在package.json中的browserslist字段中添加浏览器版本
        "browsers": [
          "defaults",
          "not ie < 11",
          "last 20 versions",
          "> 1%",
          "iOS 7",
          "last 3 iOS versions"
        ]
      })
    ]
  };