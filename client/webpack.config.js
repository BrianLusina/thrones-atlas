const path = require("path");
const BabiliPlugin = require("babili-webpack-plugin");

// used to transpile ES8 JS for the browser
const babelLoader = {
    test: /\js$/,
    loader: "babel-loader",
    include: [path.resolve(__dirname, "./src")],
    query: {
        presets: ["env"]
    }
}

// scss loader for traspiling SCSS files to CSS
const scssLoader = {
    test: /\.scss$/,
    loader: "style-loader!css-loader!sass-loader"
}

// url loader to resolve data urls at build time
const urlLoader = {
    test: /\.(.png|svg|woff|woff2|eot|ttf)$/,
    loader: "url-loader?limit=100000"
}

// html loader allows us to import HTML templates in JS files
const htmlLoader = {
    test: /\.(html)$/,
    use: {
        loader: 'html-loader',
        options: {
            attrs: [':data-src'],
            minimize: true
        }
    },
    exclude: /node_modules/,
}

const env = process.env.NODE_ENV;

const webpackConfig = {
    // start at src/index.js
    entry: ["babel-polyfill", "./src/index.js"],
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bundle.js" // output to public/bundle.js
    },
    module: {
        rules: [
            babelLoader, scssLoader, urlLoader, htmlLoader
        ]
    }
}

if (env === "production") {
    webpackConfig.plugins = [new BabiliPlugin({})]
} else {
    // generate source maps for dev build
    webpackConfig.devtool = "eval-source-map"
}

module.exports = webpackConfig