import styles from './ErrorLayout.module.css';

/**
 * @param {object} p
 * @param {string} p.imageUrl
 * @param {string} p.imageAlt
 * @param {any} [p.header]
 * @param {any} [p.footer]
 */
function ErrorLayout({ imageUrl, imageAlt, header, footer }) {
  return (
    <div className={styles.root}>
      <div className={styles.header}>{header}</div>
      <img src={imageUrl} alt={imageAlt} className={styles.poster} />
      <div className={styles.footer}>{footer}</div>
    </div>
  );
}

export default ErrorLayout;
