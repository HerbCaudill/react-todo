import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig({
  plugins: [wasm(), topLevelAwait(), react()],

  worker: {
    format: 'es',
    plugins: () => [wasm(), topLevelAwait()],
  },

  optimizeDeps: {
    // This is necessary because otherwise `vite dev` includes two separate
    // versions of the JS wrapper.
    exclude: ['@automerge/automerge-wasm/bundler/bindgen_bg.wasm', '@syntect/wasm'],
  },

  server: {
    fs: {
      strict: false,
    },
  },
})
