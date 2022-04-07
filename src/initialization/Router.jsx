import { Router } from 'preact-router';
import { useEffect } from 'preact/hooks';
import Redirect from './Redirect';
import Layout from './Layout';
import routes from '../routes/routes';
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

const WrappedRouter = () => (
  <Router>
    {redirects.map(({ id, path, to }) => (
      <Redirect key={`redirects-${id}`} path={path} to={to} />
    ))}
    {routes.map((route) => (
      <RouteComponent
        key={route.path}
        path={route.path}
        route={route}
        default={route.default}
      />
    ))}
  </Router>
);

export default WrappedRouter;
