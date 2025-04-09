/*
 * @Description: 
 * @Author: 
 * @Date: 2022-11-02 15:41:39
 * @LastEditors: 
 * @LastEditTime: 2024-10-21 14:13:07
 */
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
module.exports = {
  publicPath: "./",
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false, // 是否在构建生产包时生成sourcdeMap
  devServer: {
    // proxy: {
    //   "/api": {
    //     target: "http://127.0.0.1:8888",
    //     changeOrigin: true,
    //     ws: true,
    //     pathRewrite: {
    //       "^/api": "",
    //     },
    //   },
    // },
  },
  // configureWebpack: {
  //   plugins: [
  //     new CopyWebpackPlugin([
  //       {
  //         from: path.resolve(__dirname, 'src/views'),
  //         to: path.resolve(__dirname, 'dist/pages'),
  //         ignore: '.*'
  //       }
  //     ]),
  //   ]
  // },
}