var path = require('path');
var mm = require('micromatch');
var glob = require('glob-fs')({
	gitignore: true
});
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var CopyPlugin = require('copy-webpack-plugin');

let config = {
	target:'web',
	mode: 'development',
	entry: () => {
		entries = {
			background: './src/background.ts',
			contentscript: './src/contentscript.ts',
			framescript: './src/framescript.ts',
		};

		return new Promise((res) => {
			glob.readdir('./src/ui/**/*.js', (err, files) => {
				files.forEach(f => {
					let fullPath = path.join(__dirname, f);
					let fileInfo = path.parse(fullPath);
					entries[fileInfo.name] = fullPath;
				});
				res(entries);
			});
		});
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: (chunkData)=>{
			return '[name].js'
		},
		sourceMapFilename: '[file].map',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader',
					  'css-loader']
			},
			{
				test: /\.ts$/,
				use: 'ts-loader'
			},
			{
				test: /\.(png|jpe?g|gif)$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[path][name].[ext]',
						outputPath: 'images',
					}
				}]
			},
			{
				test: /.json$/,
				use:[{
					loader:'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: '.',
					}
				}]
			},
			{
				test: /\.html$/,
				exclude: /(node_modules|bower_components)/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
					}
				}]
			},
			{
				test: /\.txt$/,
				use: 'raw-loader'
			},
		]
	},
	plugins: [
		//new WebpackCleanupPlugin(),
		new CopyPlugin([{
				from: './src/manifest.json',
				to: 'manifest.json'
			}
		])
	],
	mode: 'development',
	optimization: {
		namedChunks: true,
		minimize: false,
	},
	resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".ts", ".tsx", ".js"],
	},
	//devtool: 'source-map',
};

module.exports = config;