import SWPreCacheWebpackPlugin from 'sw-precache-webpack-plugin';

export const navigateFallback = '/index.html';
export const navigateFallbackWhitelist = [/^(?!\/__)/];
export const stripPrefix = '../dist';
export const root = '../dist/';
export const plugins = [
	new SWPreCacheWebpackPlugin({
		cacheId: 'ultragymnasium',
		filename: 'service-worker.js',
		staticFileGlobs: ['../dist/index.html', '../dist/**.js', '../dist/**.css'],
		stripPrefix: '../dist/assets/',
		mergeStaticsConfig: true,
	}),
];
