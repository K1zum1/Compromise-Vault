import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		visualizer(),
		checker({
			typescript: true,
			eslint: {
				lintCommand: 'lint',
				dev: {
					logLevel: ['error', 'warning'],
				},
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@modules': path.resolve(__dirname, './src/modules'),
			'@helpers': path.resolve(__dirname, './src/helpers'),
			'@configs': path.resolve(__dirname, './src/configs'),
			'@apis': path.resolve(__dirname, './src/apis'),
			'@styles': path.resolve(__dirname, './src/styles'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
			'@types': path.resolve(__dirname, './src/types'),
			'@stores': path.resolve(__dirname, './src/stores'),
			'@utils': path.resolve(__dirname, './src/utils'),
		},
	},
	optimizeDeps: {},
	build: {
		rollupOptions: {
			onwarn(warning, warn) {
				if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
					return;
				}
				warn(warning);
			},
		},
	},
});
