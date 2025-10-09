import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// Получаем путь к текущей папке
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@core": path.resolve(__dirname, "../frontend-core/src"),
        },
    },
    server: {
        host: '0.0.0.0',
        allowedHosts: [
            'workswap.org'
        ],
        port: 30000,
    },
    define: {
        global: 'window'
    },
    preview: {
        port: 30000
    }
})
