import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3003';

export default defineConfig({
    plugins: [tailwindcss(), sveltekit() ],

    server: {
        port: 5173,
        host: '0.0.0.0',
        strictPort: true,
        proxy: {
            '/api': {
                target: `${BACKEND_URL}/web`,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
            '/socket.io': {
                target: BACKEND_URL,
                ws: true,
                changeOrigin: true,
            },
        }
    },
});