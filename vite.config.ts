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
		},
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes('node_modules')) {
						if (id.includes('firebase')) {
							return 'firebase';
						}
						if (id.includes('svelte')) {
							return 'svelte';
						}
						return 'vendor';
					}
				},
			},
		},
		commonjsOptions: {
			include: [/node_modules/],
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
	
	// Define global constants
	define: {
		global: 'globalThis',
	},
});
