const path = require('path');
const config = require('../config');

exports.assetsSubDir = function(pathUrl){
    let subDir = process.env.NODE_ENV !== 'production'
    ?config.dev.assetsSubDir:config.build.assetsSubDir

    return  path.posix.join(subDir,pathUrl)
}