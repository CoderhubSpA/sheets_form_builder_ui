import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
//import legacy from '@vitejs/plugin-legacy'
import vue2 from '@vitejs/plugin-vue2'
import { resolve } from 'pathe'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2(),
    /** https://github.com/vitejs/vite/issues/1639 */
    /* legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }) */
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: './',
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'lib/index.js'),
      name: 'FormBuilderUi',
      // the proper extensions will be added
      fileName: 'index',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
