import { resolve } from 'path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
	plugins: [solidPlugin()],
	build: {
		target: 'esnext',
	},
	resolve: {
		alias: [
			{
				find: 'src',
				replacement: resolve(__dirname, 'src'),
			},
		],
	},
});
