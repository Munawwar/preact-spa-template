import { lazy } from 'preact-iso';
import { useErrorBoundary } from 'preact/hooks';
import CrashSvgUrl from '../../third-party/illustrations/crash.svg';

const ErrorLayout = lazy(() => import('./ErrorLayout'));

/**
 * @param {object} props
 * @param {import('@/Route').PageComponent} props.component
 * @param {import('@/Route').PageComponentProps} props.componentProps
 */
const Layout = (props) => {
  const { component: Page, componentProps } = props;
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
  return <Page {...componentProps} />;
};

export default Layout;
