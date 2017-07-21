var path = require('path');

var DEV = process.env.NODE_ENV === 'development';
// process.traceDeprecation = true;
console.log(DEV);

var config = {
  entry: './src/index.js',
  context: __dirname,
  module: {
    rules: [{
      test: /\.js(x)?$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['react','es2015','stage-1']
        },
      }],

    },
		{
		  test: /\.less$/,
		  use: ['style-loader', 'css-loader', 'less-loader']
		},
		{
			test: /.*\.(gif|png|jpe?g|svg|woff|svg|eot|ttf)$/i,
			use: "url-loader"
		}
	]
  },
  output: {
    path: __dirname + '/lib',
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  externals: /^[@a-z]/,
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
};

if (DEV) {
  const PORT=9080;
  config.devtool = 'eval-source-map';
  config.entry = {
    index: './example/index.js',
  };
  config.devServer = {
    hot: false,
    port:PORT,
    compress: true,
    contentBase: path.join(__dirname, './'),
    headers: {
      'X-Custom-Header': 'yes',
      'Access-Control-Allow-Origin': '*',
    }
  };
  config.output = {
    path: __dirname + '/dist',
    filename:'[name].js',
    publicPath: '//localhost:'+PORT+'/dist/'
  };
	config.externals= [];
}

module.exports = config;
