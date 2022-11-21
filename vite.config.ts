import { resolve } from 'path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
	plugins: [solidPlugin()],
	base: '/AniScore/',
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
