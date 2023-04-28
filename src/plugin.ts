import type { Plugin, HmrContext } from 'vite'

export function vitePluginServerLog(): Plugin {
  let hmrContext: HmrContext
  const viteTag = 'VITE_'
  return {
    name: 'vite-plugin-server-log',
    enforce: 'pre',
    handleHotUpdate(ctx) {
      hmrContext = ctx
    },
    configureServer({ watcher, printUrls, config }) {
      watcher.on('all', (_, file) => {
        const queue = config.plugins.map(plugin => (plugin.handleHotUpdate && hmrContext ? (plugin as any).handleHotUpdate(hmrContext) : Promise.resolve()))
        Promise.all(queue).then((fullModules) => {
          const filteredModules = fullModules.filter((item) => item && item.length)
          if (filteredModules.length || hmrContext?.modules.length) {
            // hmr update
            config.logger.info('')
            printUrls()
          }

          if (!hmrContext?.modules.length) {
            if (file.endsWith('.vue')) {
              // page reload
              const envInfo = Object.keys(config.env).filter(item => item.startsWith(viteTag)).map(key => {
                return `${key}: ${config.env[key]}`
              }).join('; ')
              config.logger.info(`🚀 ~ mode: ${config.mode}; env: { ${envInfo} }\n`)
              printUrls()
            }
          }
        })
      })
    }
  }
}


