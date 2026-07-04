import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const apiTarget = process.env.VITE_API_TARGET || 'http://localhost:3000';

export default defineConfig({
    plugins: [svelte()],
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: {
            '/<%= shortname %>': {
                target: apiTarget,
                changeOrigin: true,
                ws: true
            },
            '/<%= shortname %>/socket.io': {
                target: apiTarget,
                changeOrigin: true,
                ws: true
            }
        }
    }
});
