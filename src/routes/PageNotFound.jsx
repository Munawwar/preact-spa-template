import PageNotFoundSvgUrl from '../third-party/illustrations/page-not-found.svg';
import ErrorLayout from '../components/layout/ErrorLayout';

const PageNotFound = () => (
  <ErrorLayout imageUrl={PageNotFoundSvgUrl} imageAlt="Page not found" header="Page Not Found" />
);

export default PageNotFound;
