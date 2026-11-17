/** YAML files are parsed at build time by the plugin in vite.config.ts. The shape is checked where they are used. */
declare module '*.yaml' {
  const data: unknown
  export default data
}
