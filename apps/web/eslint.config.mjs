import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import react from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactHooks from 'eslint-plugin-react-hooks';
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
			'plugin:react/recommended',
			'plugin:react/jsx-runtime',
			'plugin:react-hooks/recommended',
		),
	),
	{
		plugins: {
			react: fixupPluginRules(react),
			'react-refresh': reactRefresh,
			'react-hooks': fixupPluginRules(reactHooks),
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
						['@components', './src/components'],
						['@modules', './src/modules'],
						['@helpers', './src/helpers'],
						['@configs', './src/configs'],
						['@utils', './src/utils'],
						['@apis', './src/apis'],
						['@styles', './src/styles'],
						['@hooks', './src/hooks'],
						['@types', './src/types'],
						['@stores', './src/stores'],
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
			'react-refresh/only-export-components': ['error'],

			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						['^react'],
						['^@mantine'],
						['^@?\\w'],
						['^@(configs)(/.*|$)'],
						['^@(apis)(/.*|$)'],
						['^@(components)(/.*|$)'],
						['^@(helpers)(/.*|$)'],
						['^@(modules)(/.*|$)'],
						['^@(types)(/.*|$)'],
						['^@(stores)(/.*|$)'],
						['^@(hooks)(/.*|$)'],
						['^@(styles)(/.*|$)'],
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
