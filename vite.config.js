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
            "#": path.resolve(__dirname, "./public"),
        },
    },
    server: {
        port: 8080,
        proxy: {
            "/proxy": {
                target: "https://api.workswap.org",
                changeOrigin: true,
                secure: false,
            },
        },
    },
    define: {
        global: 'window'
    },
    preview: {
        port: 8080
    }
})
