import styles from './Container.module.css';
import { cx } from '../../utils/classNames';

/** Centers page content and gives it consistent side padding. */
export default function Container({ children, padded = false, className }) {
  return (
    <div className={cx(styles.container, padded && styles.padded, className)}>
      {children}
    </div>
  );
}
