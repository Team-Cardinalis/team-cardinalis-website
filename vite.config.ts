import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	
	// Build optimizations
	build: {
		target: 'esnext',
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		} as any,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['firebase'],
					svelte: ['svelte'],
				},
			},
		},
	},
	
	// Development optimizations
	server: {
		fs: {
			allow: ['..'],
		},
	},
	
	// CSS optimizations
	css: {
		devSourcemap: true,
	},
	
	// Resolution optimizations
	resolve: {
		alias: {
			'@': '/src',
		},
	},
	
	// Preload optimizations
	optimizeDeps: {
		include: ['firebase/app', 'firebase/auth', 'firebase/database'],
		exclude: ['@sveltejs/kit'],
	},
});
