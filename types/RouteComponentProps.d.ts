export type RouteComponentProps = {
  routeId: string;
  title: string;
  matches: {
    [param: string]: string,
  };
  path: string;
  url: string;
}