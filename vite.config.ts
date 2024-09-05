import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		outDir: 'dist'
	},
	server: {
		open: false
	},
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './frontend')
		}
	}
})
