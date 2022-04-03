import { Link } from 'preact-router';
import svgUrl from '../third-party/illustrations/well-done.svg';
import styles from './Home.module.css';

/**
 * @param {import('@/RouteComponentProps').RouteComponentProps} props
 */
function Home(props) {
  return (
    <div class={styles.root}>
      <h1 style={{ textAlign: 'center' }}>Preact Vite SPA Starter Template</h1>

      <div>
        <img src={svgUrl} alt="Hooray!" class={styles.image} />
        <div class={styles.text}>
          <strong>Hooray! The thing works!</strong>
        </div>
      </div>

      <h2>Check out other pages</h2>
      <p>
        <Link href="/this-url-does-not-exist">404 Page</Link>
      </p>
      <p>
        <Link href="/error">Error Page</Link>
      </p>

      <p>You are at the {props.title} page</p>
    </div>
  );
}
export default Home;
