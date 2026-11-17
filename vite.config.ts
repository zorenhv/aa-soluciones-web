import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		{
			name: 'safe-sveltekit-fetch',
			enforce: 'pre',
			transform(code: string, id: string) {
				if (id.includes('@sveltejs/kit/src/runtime/client/fetcher.js')) {
					return code.replace(
						/window\.fetch\s*=\s*\(input,\s*init\)\s*=>\s*\{([\s\S]*?)return native_fetch\(input, init\);\s*\};/g,
						'try { window.fetch = (input, init) => {$1return native_fetch(input, init);\n\t}; } catch {}'
					);
				}
				return null;
			}
		},
		tailwindcss(),
		sveltekit({
			alias: {
				$lib: 'src/lib'
			},
			adapter: adapter({
				pages: 'dist',
				assets: 'dist',
				fallback: 'index.html',
				precompress: false,
				strict: false
			})
		}),
		// Copies src/assets into dist/ so root-relative URLs like
		// "/src/assets/images/..." (e.g. generate_image output) still resolve
		// in production builds.
		{
			name: 'copy-unbundled-src-assets',
			apply: 'build',
			closeBundle(error?: Error): void {
				if (error) {
					return;
				}
				const distDir = path.resolve(import.meta.dirname, 'dist');
				const srcAssets = path.resolve(import.meta.dirname, 'src/assets');
				const distAssets = path.resolve(distDir, 'src/assets');
				if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
					fs.cpSync(srcAssets, distAssets, { recursive: true, force: true });
				}
			}
		}
	],
	server: {
		// HMR is disabled in AI Studio via DISABLE_HMR env var.
		hmr: process.env.DISABLE_HMR !== 'true',
		watch: process.env.DISABLE_HMR === 'true' ? null : {}
	}
});
