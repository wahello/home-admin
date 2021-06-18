// https://umijs.org/config/
import { defineConfig } from 'umi';

import defaultSettings from './defaultSettings';
import routes from './routes';
import proxy from './proxy';


export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
    'border-radius-base': '8px',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  // Fast Refresh 热更新
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  proxy: proxy['dev'],
  // extraBabelPlugins: [['import', {
  //   libraryName: '@ant-design/charts',
  //   libraryDirectory: 'lib',
  // }]],

});
