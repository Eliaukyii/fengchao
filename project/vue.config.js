
const { defineConfig } = require("@vue/cli-service");
// 开启gzip压缩
const CompressionWebpackPlugin = require("compression-webpack-plugin");

module.exports = defineConfig({
  publicPath: '/',
  outputDir: 'dist',
  transpileDependencies: true,
  lintOnSave: false,

  devServer: {
    proxy: {
      "/api": {
        target: "http://shysqf.3322.org:13559",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
  },

  //配置gzip压缩
  configureWebpack: (config) => {
    config.plugins.push(
      new CompressionWebpackPlugin({
        algorithm: "gzip",
        test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
        threshold: 10240,
        minRatio: 0.8,
      })
    );
    //开启js分离
    config.optimization = {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "npm.vendor",
            chunks: "all",
          },
        },
      },
    };
    config.performance = {
      hints: "warning",
      //入口起点的最大体积
      maxEntrypointSize: 50000000,
      //生成文件的最大体积
      maxAssetSize: 30000000,
      //只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith(".js");
      },
    };
  },
});
