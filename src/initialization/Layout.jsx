import { useErrorBoundary } from 'preact/hooks';
import ErrorLayout from '../components/layout/ErrorLayout';
import CrashSvgUrl from '../third-party/illustrations/crash.svg';

const Layout = (props) => {
  const { component: Page, route } = props;
  // You can add logging inside useErrorBoundary()
  const [error] = useErrorBoundary();

  if (error) {
    return (
      <ErrorLayout
        imageUrl={CrashSvgUrl}
        imageAlt="Unexpected error"
        header="Ooops! Something went wrong."
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
  return <Page {...route} />;
};

export default Layout;
