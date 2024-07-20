export type PageComponentProps = {
  /** Route ID as defined in 'src/routes/routes.js' */
  routeId: string;
  /** Page title as defined in 'src/routes/routes.js' */
  title: string;
  /** Route pattern as defined in 'src/routes/routes.js'. e.g. '/user/:id' */
  path: string;
  /** Set to true if the current route was set as the default route on preact-iso router. This is as defined in 'src/routes/routes.js' */
  default?: boolean;
  /** URL from preact-iso useLocation() hook. It is part of the URI without origin and URI fragment. e.g '/user/123?tab=subscription' */
  url: string;
  /** params from preact-iso useRoute() hook. e.g { id: '123' } */
  params: Record<string, string>;
  /** query from preact-iso useRoute() hook. e.g { tab: 'subscription' } */
  query: Record<string, string>;
};

export type Route = {
  routeId: string;
  title: string | ((props: object) => string);
  path: string;
  Component: (props: PageComponentProps) => import('preact/jsx-runtime').JSX.Element;
  default?: boolean;
};

export type PageComponent = Route['Component'];
