let SWPreCacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = {
	navigateFallback: '/index.html',
	navigateFallbackWhitelist: [/^(?!\/__)/],
	stripPrefix: '../public',
	root: '../public/',
	plugins: [
		new SWPreCacheWebpackPlugin({
			cacheId: 'ultragymnasium',
			filename: 'service-worker.js',
			staticFileGlobs: ['../public/index.html', '../public/**.js', '../public/**.css'],
			stripPrefix: '../public/assets/',
			mergeStaticsConfig: true,
		}),
	],
};
