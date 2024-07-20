import { lazy } from 'preact-iso';

/** @type {import('@/Route').Route[]} */
const routes = [
  {
    routeId: 'home',
    title: 'Home',
    path: '/',
    Component: lazy(() => import('./Home')),
  },
  {
    routeId: 'error',
    title: 'Error Test Page',
    path: '/error',
    // @ts-ignore
    Component: lazy(() => import('./ErrorTest')),
  },
  {
    routeId: '404',
    title: 'Page Not Found',
    path: '',
    default: true,
    Component: lazy(() => import('./PageNotFound')),
  },
];

export default routes;
