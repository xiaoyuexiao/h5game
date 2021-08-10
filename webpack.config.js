const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 负责将html文档虚拟到根目录下
let htmlWebpackPlugin = new HtmlWebpackPlugin({
    // 虚拟的html文件名 index.html
    filename: 'index.html',
    // 虚拟html的模板为 src下的index.html
    template: path.resolve(__dirname, './public/index.html'),
    inject: true
})

module.exports = {
    // 开发模式
    mode: 'development',
    // 配置入口文件
    entry: './src/index.js',
    // 出口文件目录为根目录下dist, 输出的文件名为main
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx|\.js?$/,
                exclude: /node_modules/, 
                use: {
                    loader: 'babel-loader',
                    options: {
                        // babel 转义的配置选项
                        babelrc: false,
                        presets: [
                            // 添加 preset-react
                            require.resolve('@babel/preset-react'),
                            [require.resolve('@babel/preset-env'), 
                            {modules: false}]
                        ],
                        cacheDirectory: true
                    }
                }
            },
            {
                test:/.jpg|.png$/,
                use:'url-loader'
            }
        ]
    },
    // 配置开发服务器, 并配置自动刷新
    devServer: {
        // 根目录下dist为基本目录
        contentBase: path.join(__dirname, 'dist'),
        // 自动压缩代码
        compress: true,
        // 服务端口为1208
        host: '127.0.0.1',
        port: 3003,
        // 自动打开浏览器
        open: false,
        stats: {
            color: true
        },
        hot: true
    },
    // 装载虚拟目录插件
    plugins: [htmlWebpackPlugin],
}