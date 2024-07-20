export type PageComponentProps = {
  routeId: string;
  title: string;
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  rest: string;
  default?: boolean;
}

export type Route = {
  routeId: string;
  title: string | ((props: object) => string);
  path: string;
  Component: (props: PageProps) => import('preact/jsx-runtime').JSX.Element;
  default?: boolean;
};

export type PageComponent = Route['Component'];