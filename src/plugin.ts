import type { HmrContext, Plugin } from 'vite'
import colors from 'picocolors'

export function vitePluginServerLog(): Plugin {
  let hmrContext: HmrContext
  const viteTag = 'VITE_'
  return {
    name: 'vite-plugin-server-log',
    enforce: 'pre',
    handleHotUpdate(ctx) {
      hmrContext = ctx
    },
    configureServer({ watcher, config }) {
      watcher.on('all', () => {
        if (!hmrContext.modules.length)
          return
        const envInfo = Object.keys(config.env)
          .filter(item => item.startsWith(viteTag))
          .map((key) => {
            return `${colors.blue(key)}: ${colors.magenta(config.env[key])}`
          })
          .join('; ')
        const right = colors.green('➜')
        config.logger.info(
          `  ${right}  ${colors.dim('mode:')}  ${colors.magenta(config.mode)}`,
        )
        config.logger.info(`  ${right}  ${colors.dim('env:')}  { ${envInfo} }`)
        const link = `http://127.0.0.1:${config.server.port}/`
        const serverInfo = `  ${right}  Local:   ${colors.cyan(link)}
  ${right}  ${colors.dim('Network: use')} --host ${colors.dim('to expose')}
  ${right}  ${colors.dim('press')} h ${colors.dim('to show help')}
  `
        config.logger.info(serverInfo)
      })
    },
  }
}
