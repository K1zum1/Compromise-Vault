import { fixupConfigRules } from '@eslint/compat';
import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ['**/dist', '**/.eslintrc.cjs', '**/eslint.config.mjs'],
	},
	...fixupConfigRules(
		compat.extends(
			'eslint:recommended',
			'plugin:import/recommended',
			'plugin:@typescript-eslint/recommended',
		),
	),
	{
		plugins: {
			'unused-imports': unusedImports,
			'simple-import-sort': simpleImportSort,
		},

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},

			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',

			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
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
						['^react'],
						['^@mantine'],
						['^@?\\w'],
						['^@(configs)(/.*|$)'],
						['^@(utils)(/.*|$)'],
						['^@(middlewares)(/.*|$)'],
						['^@(helpers)(/.*|$)'],
						['^@(modules)(/.*|$)'],
						['^@(types)(/.*|$)'],
						['^@(/*)(/.*|$)'],
						['^(@styles)(/.scss|$)'],
						['^\\.\\.(?!/?$)', '^\\.\\./?$'],
						['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
					],
				},
			],

			'simple-import-sort/exports': 'error',
		},
	},
];
