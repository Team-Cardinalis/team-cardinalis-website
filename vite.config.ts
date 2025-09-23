import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	
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
			// Fix Firebase modular imports
			'firebase': '/node_modules/firebase',
		},
		// Fix Firebase v12+ imports
		dedupe: ['firebase'],
	},
	
	// Preload optimizations
	optimizeDeps: {
		include: ['firebase/app', 'firebase/auth', 'firebase/database'],
		exclude: ['@sveltejs/kit'],
	},

	// Firebase-specific build configuration
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
				manualChunks: (id) => {
					if (id.includes('firebase')) {
						return 'firebase';
					}
					if (id.includes('node_modules')) {
						return 'vendor';
					}
				},
			},
			// Ensure Firebase modules are bundled correctly
			external: [],
		},
		commonjsOptions: {
			include: [/firebase/, /node_modules/],
		},
	},
});
