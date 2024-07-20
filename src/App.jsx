import {
  LocationProvider,
  ErrorBoundary,
  Router,
  useLocation,
} from 'preact-iso';
import { useEffect, useLayoutEffect } from 'preact/hooks';
import Layout from './components/layout/AppLayout';
import routes from './routes/routes';
import redirects from './redirects';

const RouteComponent = (props) => {
  const { route, url, matches } = props;

  const title =
    typeof route.title === 'function'
      ? route.title(props)
      : route.title.replace(/:([^\b]+)/g, (m, name) => matches?.[name] ?? m);
  useEffect(() => {
    document.title = ['My App', route.title].join(' | ');
  }, []);

  return (
    <Layout
      component={route.Component}
      route={{
        routeId: route.routeId,
        path: route.path,
        title,
        url,
        matches,
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
            <RouteComponent
              key={route.path}
              path={route.path}
              route={route}
              default={route.default}
            />
          ))}
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  );
}

export default App;
