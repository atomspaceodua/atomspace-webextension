let path = require('path');

let arrify = require('arrify');
let deepmerge = require('deepmerge');

module.exports = function (neutrino, settings = {}) {
	const NODE_MODULES = path.resolve(__dirname, '../node_modules');
	let config = neutrino.config;
	let compileRule = config.module.rule('compile');
	let compileRuleExtensions = arrify(compileRule.get('test'));

	if (!settings.browsers) {
		settings.browsers = [
			'last 3 chrome versions',
			'last 3 firefox versions',
			'last 3 edge versions',
			'last 3 opera versions',
			'last 3 safari versions',
			'last 1 ie version',
			'last 1 ie_mob version',
			'last 1 blackberry version',
			'last 3 and_chr versions',
			'last 3 and_ff versions',
			'last 3 op_mob versions',
			'last 2 op_mini versions',
			'ios >= 8',
			'android >= 4'
		];
	}

	compileRule
		.test(compileRuleExtensions.concat(/\.js$/))
		.include
			.merge(settings.include || [])
			.end()
		.exclude
			.merge(settings.exclude || [NODE_MODULES])
			.end()
		.use('babel')
			.loader(require.resolve('babel-loader'))
			.tap((opts = {}) => deepmerge(opts, {
				presets: [
					[require.resolve('babel-preset-env'), {
						debug: false,
						loose: false,
						modules: false,
						useBuiltIns: true,
						include: [],
						exclude: [],
						targets: {
							browsers: settings.browsers
						}
					}]
				],
				plugins: [
					require.resolve('babel-plugin-syntax-dynamic-import'),
					require.resolve('babel-plugin-transform-object-rest-spread'),
					require.resolve('babel-plugin-transform-class-properties')
				]
			}))
			.end();
};