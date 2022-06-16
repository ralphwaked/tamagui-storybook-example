const webpack = require('webpack')
const path = require('path')
const { shouldExclude } = require('tamagui-loader')

const projectRoot = path.resolve(__dirname, "..")
const target = process.env.TARGET || 'css'

const tamaguiOptions = {
	config: '.storybook/tamagui.config.ts',
	components: ['tamagui'],
	importsWhitelist: ['constants.js', 'colors.js'],
	logTimings: true,
	disableExtraction: process.env.NODE_ENV === 'development'
}

module.exports = {
	stories: [
		"../stories/**/*.stories.mdx",
		"../stories/**/*.stories.@(js|jsx|ts|tsx)"
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions"
	],
	framework: "@storybook/react",
	core: {
		builder: "@storybook/builder-webpack5"
	},
	webpackFinal: (config) => {
		console.log(config.resolve.extensions)
		console.log(config.resolve.mainFields)
		console.log(config.resolve.aliases)
		 return {
			 ...config,
			 resolve: {
					...config.resolve,
					extensions: [`${target}.ts`, `${target}.tsx`, '.web.js', '.ts', '.tsx', '.js'],
					mainFields: ['module:jsx', 'browser', 'module', 'main'],
					alias: {
						'react-native$': 'react-native-web',
						'react-native/Libraries/Renderer/shims/ReactFabric': '@tamagui/proxy-worm',
						'react-native-reanimated': require.resolve('react-native-reanimated'),
						'react-native-reanimated$': require.resolve('react-native-reanimated'),
					},
				},
			 module: {
				 ...config.module,
				 rules: [
					 ...config.module.rules,
					{
						test: /\.[jt]sx?$/,
						// todo
						exclude: path => shouldExclude(path, projectRoot, tamaguiOptions),
						use: [
							// todo: get thread-loader working later
							// optionally thread-loader for significantly faster compile!
							// 'thread-loader',
		
							{
								loader: 'esbuild-loader',
								options: {
									loader: 'tsx',
									minify: process.env.NODE_ENV === 'production',
								},
							},
							{
								loader: 'tamagui-loader',
								options:  tamaguiOptions
							},
						]
					}
				 ]
			 },
			 plugins: [
				 ...config.plugins,
				 new webpack.DefinePlugin({
					'process.env.TAMAGUI_TARGET': '"web"',
				})
			 ]
		 }
	}
}
