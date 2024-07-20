import { useErrorBoundary } from 'preact/hooks';
import ErrorLayout from './ErrorLayout';
import CrashSvgUrl from '../../third-party/illustrations/crash.svg';

/**
 * @param {object} props
 * @param {import('preact').ComponentType} props.component
 * @param {import('./../../../types/RouteComponentProps')} props.route
 */
const Layout = (props) => {
  const { component: Page, route } = props;
  // You can add logging inside useErrorBoundary()
  const [error] = useErrorBoundary((err) => console.error(err));

  if (error) {
    return (
      <ErrorLayout
        imageUrl={CrashSvgUrl}
        imageAlt="Unexpected error"
        header="Oops! Something went wrong."
        footer={
          <>
            We apologize for the inconvenience.
            <br />
            Please report the issue to customer support.
          </>
        }
      />
    );
  }

  // Your layout can be much more complex than this. Don't you want a side menu?
  return <Page {...route} />;
};

export default Layout;
