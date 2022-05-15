let SWPreCacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = {
	navigateFallback: '/index.html',
	navigateFallbackWhitelist: [/^(?!\/__)/],
	stripPrefix: '../dist',
	root: '../dist/',
	plugins: [
		new SWPreCacheWebpackPlugin({
			cacheId: 'ultragymnasium',
			filename: 'service-worker.js',
			staticFileGlobs: ['../dist/index.html', '../dist/**.js', '../dist/**.css'],
			stripPrefix: '../dist/assets/',
			mergeStaticsConfig: true,
		}),
	],
};
