import { lazy as preactIsoLazy } from 'preact-iso';

const importFilePathRegex = /\(\s*\)\s*=>\s*import\s*\(\s*['"]\s*(.+)\s*['"]\s*\)/;
/**
 * @type {typeof preactIsoLazy}
 */
function lazy(func) {
  const val = preactIsoLazy(func);
  // @ts-ignore
  val.chunkPath = func.toString().match(importFilePathRegex)?.[1];
  return val;
}

/**
 * This function is solely to please typescript
 * @template {string} PathPattern
 * @template {Omit<import('@/Route').Route<PathPattern>, 'path'>} Options
 * @param {PathPattern} path
 * @param {Options} options
 * @returns {import('@/Route').Route<PathPattern>}
 */
const route = (path, options) => ({ path, ...options });

const routes = [
  route('/', {
    routeId: 'home',
    title: 'Home',
    Component: lazy(() => import('./Home')),

    // Less flexible but higher priority preloading
    // preload: [{
    //   as: 'fetch',
    //   href: '/api/test',
    // }],

    // More flexible but lower priority preloading
    // Read the jsdoc for more info
    // eslint-no-closure
    getPrefetchUrls: () => ({ '/api/test': '/api/test' }),
  }),

  route('/home', {
    routeId: 'home',
    title: 'Home',
    Component: lazy(() => import('./Home')),
    // eslint-no-closure
    getPrefetchUrls: () => ({ '/api/test': '/api/test' }),
  }),

  route('/user/:id', {
    routeId: 'user',
    title: 'User (:id)',
    Component: lazy(() => import('./User')),
    preload: [
      {
        as: 'fetch',
        href: '/api/test',
      },
    ],
  }),

  route('/error', {
    routeId: 'error',
    title: 'Error Test Page',
    // @ts-ignore
    Component: lazy(() => import('./ErrorTest')),
  }),

  route('', {
    routeId: '404',
    title: 'Page Not Found',
    default: true,
    Component: lazy(() => import('./PageNotFound')),
  }),
];

export default routes;
