import styles from './Notice.module.css';
import { cx } from '../../utils/classNames';

/**
 * Coloured message box.
 * tone: 'info' (yellow) | 'success' (green) | 'error' (red)
 */
export default function Notice({ tone = 'info', title, children, className }) {
  return (
    <div
      className={cx(styles.notice, styles[tone], className)}
      role={tone === 'error' ? 'alert' : undefined}
    >
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
