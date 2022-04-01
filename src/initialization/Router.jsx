import Helmet from 'preact-helmet';
import { Router } from 'preact-router';
import Redirect from './Redirect';
import Layout from './Layout';
import routes from '../routes/routes';
import redirects from './redirects';

const RouteComponent = (props) => {
  const { route, url, matches: match } = props;
  return (
    <>
      <Helmet
        title={['Preact Vite SPA Starter Template', route.title].join(' | ')}
      />
      <Layout
        component={route.Component}
        route={{
          routeId: route.routeId,
          path: route.path,
          title: route.title,
          url,
          match,
        }}
      />
    </>
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
