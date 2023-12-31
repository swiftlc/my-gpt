import { viteMockServe } from 'vite-plugin-mock';

export default (viteEnv: ImportMetaEnv) => {
  // const prodMock = viteEnv.VITE_PROD_MOCK === 'Y';

  return viteMockServe({
    mockPath: 'mock',
    logger: true,
  });
};
