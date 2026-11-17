import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { parse } from 'yaml'

/** Lets the app `import` YAML files (resume.yaml) as plain data, with hot reload in dev. */
function yamlPlugin(): Plugin {
  return {
    name: 'yaml',
    transform(code, id) {
      if (!/\.ya?ml$/.test(id)) return null
      return { code: `export default ${JSON.stringify(parse(code))}`, map: null }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [yamlPlugin(), react()],
  // Relative asset paths, so the build works from a domain root or a sub-path
  // (GitHub Pages project sites) without extra configuration.
  base: '/',
})
