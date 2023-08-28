import { defineConfig, loadEnv } from 'vite'
import { createViteProxy, getRootPath, getSrcPath, setupVitePlugins, viteDefine } from './build';
import { getServiceEnvConfig } from './.env-config';

// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  const rootPath = getRootPath();
  const srcPath = getSrcPath();
  const viteEnv = loadEnv(configEnv.mode, rootPath) as unknown as ImportMetaEnv;

  console.log(viteEnv);

  const isOpenProxy = viteEnv.VITE_HTTP_PROXY === 'Y';
  const envConfig = getServiceEnvConfig(viteEnv); //default dev

  return {
    base: viteEnv.VITE_BASE_URL,
    define: viteDefine,
    resolve: {
      alias: {
        '~': rootPath,
        '@': srcPath,
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/scss/global.scss" as *;`
        }
      }
    },
    plugins: [...setupVitePlugins(viteEnv)],
    server: {
      host: '0.0.0.0',
      port: 3200,
      open: true,
      proxy: createViteProxy(isOpenProxy, envConfig)
    },
  }
})
