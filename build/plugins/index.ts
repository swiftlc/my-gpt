import type { PluginOption } from 'vite';
import Vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite'
import progress from 'vite-plugin-progress';
// import VueDevtools from 'vite-plugin-vue-devtools';
import unplugin from './unplugin';
// import pageRoute from '@soybeanjs/vite-plugin-vue-page-route';
import mock from './mock';

/**
 * vite插件
 * @param viteEnv - 环境变量配置
 */
export function setupVitePlugins(viteEnv: ImportMetaEnv): (PluginOption | PluginOption[])[] {
  const plugins = [
    Vue(),
    // VueDevtools(),
    UnoCSS(),
    ...unplugin(viteEnv),
    mock(viteEnv),
    progress(),
  ];

  // if (viteEnv.VITE_SOYBEAN_ROUTE_PLUGIN === 'Y') {
  //   plugins.push(pageRoute());
  // }

  return plugins;
}
