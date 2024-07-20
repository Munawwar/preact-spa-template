import { LocationProvider, ErrorBoundary, Router, useLocation, useRoute } from 'preact-iso';
import { useEffect, useLayoutEffect } from 'preact/hooks';
import Layout from './components/layout/AppLayout';
import routes from './routes/routes';
import redirects from './routes/redirects';

/**
 * @param {object} props
 * @param {import('@/Route').Route} props.route
 * @param {string} props.path
 * @param {boolean} [props.default]
 */
const RouteComponent = (props) => {
  const { route } = props;
  const { params, query } = useRoute();
  const { url } = useLocation();

  const title =
    typeof route.title === 'function'
      ? route.title(props)
      : route.title.replace(/:([^\b]+)/g, (m, name) => params?.[name] ?? m);
  useEffect(() => {
    document.title = ['My App', title].join(' | ');
  }, []);

  return (
    <Layout
      component={route.Component}
      componentProps={{
        // route metadata
        routeId: route.routeId,
        path: route.path,
        default: route.default,
        title,
        // preact router props
        url,
        params,
        query,
      }}
    />
  );
};

function RedirectionManager() {
  const { path, route } = useLocation();
  useLayoutEffect(() => {
    const match = redirects.find((entry) => entry.path === path);
    if (match) {
      route(match.to);
    }
  }, [path]);
  return null;
}

function App() {
  return (
    <LocationProvider>
      <RedirectionManager />
      <ErrorBoundary>
        <Router>
          {routes.map((route) => (
            <RouteComponent key={route.path} path={route.path} route={route} default={route.default} />
          ))}
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  );
}

export default App;
