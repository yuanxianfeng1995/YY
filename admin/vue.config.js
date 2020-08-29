// const path = require('path');

// function resolve(dir) {
//     return path.join(__dirname, dir);
// }
// module.exports = {
//     chainWebpack: (config) => {
//         config.resolve.alias.set('src', resolve('src'))
//         config.resolve.alias.set('assets', resolve('assets'))
//     },
//     publicPath: './',
//     configureWebpack: {
//         externals: {
//             'RongIMLib': 'RongIMLib',
//             'wx': 'wx'
//         },
//         devtool: 'eval-source-map',
//     },
//     devServer: {
//         port: 80,
//         disableHostCheck: true,
//         host: 'mp.llczf.com'
//     },
// };


const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    publicPath: './',
    chainWebpack: (config) => {
        config.resolve.alias
            .set('src', resolve('src'))
    },
    configureWebpack: {
        externals: {
            'RongIMLib': 'RongIMLib',
            'wx': 'wx'
        },
        devtool: 'source-map',
    }
};