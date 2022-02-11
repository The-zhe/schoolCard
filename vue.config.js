"use strict";

const path = require("path");
const webpack = require('webpack')
const { VueLoaderPlugin } = require("vue-loader")


const port = 9527;
function resolve (dir) {
  return path.join(__dirname, dir);
}

//代理配置
const env = require("./proxy.config");
const args_type = env.getConfigType()
const { proxys, publicPath } = env.getConfig().vueConfig;

const proxy = {};
for (const key in proxys) {
  const target = proxys[key];
  proxy[`/${key}`] = {
    target, //目标接口域名
    pathRewrite: {
      [`^/${key}`]: "", //重写接口
    },
  };
}

module.exports = {
  publicPath,
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  css: {
    sourceMap: process.env.NODE_ENV === "development",
    loaderOptions: {
      postcss: {
        plugins: [
          //require("postcss-pxtorem")({
          //  rootValue: 50, // 换算的基数
          //  propList: ["*"],
          // rootValue: 100,
          // propWhiteList: []
          // minPixelValue: 2,
          // propWhiteList: [".md-"]
          // selectorBlackList: [".van-"]
          //}),
        ],
      },
    },
  },
  devServer: {
    port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy,
  },
  /* module: {
    rules: [{
      test: /\.(png|jpe?g|gif|ogv)$/i,
      use: [
        {
          loader: 'file-loader',
        },
      ]
    },]
  }, */

  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        args_type: JSON.stringify(args_type)
      })
    ],
    resolve: {
      extensions: [".js", ".vue", ".json", ".html"],
      alias: {
        "@": resolve("src"),
      },
    }
  },
  chainWebpack (config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test
    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();
    config.when(
      process.env.NODE_ENV === "development",
      (config) => config.devtool("source-map") //eval
    );

    config.when(process.env.NODE_ENV !== "development", (config) => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // only package third parties that are initially dependent
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      config.optimization.runtimeChunk("single");
    });
  },
};
