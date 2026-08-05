import { fileURLToPath } from 'node:url'
import esbuild from 'esbuild'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'

const frostedEntry = fileURLToPath(
  new URL('./app/react/frosted-entry.ts', import.meta.url),
)

/**
 * Pre-bundles Frosted UI + React into one ESM module so Vite never serves
 * raw CommonJS deps over native ESM, and so React is a single shared instance.
 */
function frostedUiBundlePlugin(): Plugin {
  const virtualId = 'virtual:frosted-ui'
  const resolvedId = '\0' + virtualId
  let cached: string | null = null

  return {
    name: 'frosted-ui-bundle',
    resolveId(id) {
      if (id === virtualId) return resolvedId
    },
    async load(id) {
      if (id !== resolvedId) return

      if (!cached) {
        const result = await esbuild.build({
          entryPoints: [frostedEntry],
          bundle: true,
          write: false,
          format: 'esm',
          platform: 'browser',
          target: ['es2020'],
          jsx: 'transform',
          jsxFactory: 'React.createElement',
          jsxFragment: 'React.Fragment',
          mainFields: ['module', 'browser', 'main'],
          conditions: ['import', 'module', 'browser', 'default'],
          logLevel: 'silent',
          loader: {
            '.css': 'empty',
          },
          define: {
            'process.env.NODE_ENV': JSON.stringify(
              process.env.NODE_ENV || 'development',
            ),
          },
        })
        cached = result.outputFiles[0]?.text ?? ''
      }

      return cached
    },
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss(), frostedUiBundlePlugin()],
    optimizeDeps: {
      // React comes from virtual:frosted-ui — don't prebundle a second copy
      exclude: ['react', 'react-dom', 'frosted-ui'],
    },
    ssr: {
      external: ['frosted-ui', '@frosted-ui/icons', 'react', 'react-dom'],
    },
  },

  build: {
    transpile: ['@frosted-ui/icons'],
  },
})
