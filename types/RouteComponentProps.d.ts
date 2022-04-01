export type RouteComponentProps = {
  routeId: string;
  title: string;
  match: {
    [param: string]: string,
  };
  path: string;
  url: string;
}