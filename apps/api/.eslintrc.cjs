module.exports = {
	root: true,
	env: { browser: true, es2020: true, node: true },
	extends: [
		'eslint:recommended',
		'plugin:import/recommended',
		'plugin:@typescript-eslint/recommended',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	plugins: ['unused-imports', 'simple-import-sort'],
	rules: {
		'prefer-const': 'error',
		'unused-imports/no-unused-imports': 'error',
		'no-use-before-define': 'error',
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		'@typescript-eslint/no-explicit-any': 'off',
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					// Package react related
					['^react'],
					// Mantine related
					['^@mantine'],
					// Other lib
					['^@?\\w'],
					// Internal package
					['^@(configs)(/.*|$)'],
					['^@(utils)(/.*|$)'],
					['^@(helpers)(/.*|$)'],
					['^@(middlewares)(/.*|$)'],
					['^@(modules)(/.*|$)'],
					['^@(types)(/.*|$)'],
					['^@(/*)(/.*|$)'],
					// Styles import
					['^(@styles)(/.scss|$)'],
					// Parent import
					['^\\.\\.(?!/?$)', '^\\.\\./?$'],
					// Same relative import
					['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
				],
			},
		],
		'simple-import-sort/exports': 'error',
	},
	settings: {
		react: {
			version: 'detect',
		},
		'import/resolver': {
			alias: {
				map: [
					['@', './src'],
					['@modules', './src/modules'],
					['@helpers', './src/helpers'],
					['@configs', './src/configs'],
					['@utils', './src/utils'],
					['@types', './src/types'],
					['@middlewares', './src/middlewares'],
				],
				extensions: ['.ts', '.tsx', '.js', '.tsx'],
			},
		},
	},
};
