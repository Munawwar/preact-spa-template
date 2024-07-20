import svgUrl from '../third-party/illustrations/well-done.svg';
import styles from './Home.module.css';

/** @type {import('@/Route').PageComponent} */
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
        <a href="/this-url-does-not-exist">404 Page</a>
      </p>
      <p>
        <a href="/error">Error Page</a>
      </p>

      <p>You are at the {props.title} page</p>
    </div>
  );
}
export default Home;
