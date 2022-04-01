import lazy from 'preact-lazy';

// TODO: preact-lazy support loading screen
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
