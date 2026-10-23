import { Check, Circle } from 'lucide-react';
import styles from './PasswordChecklist.module.css';
import { cx } from '../../utils/classNames';
import { getPasswordChecks } from '../../utils/validators';

/** Live list of password rules; each turns green as it is satisfied. */
export default function PasswordChecklist({ password }) {
  const checks = getPasswordChecks(password);

  return (
    <ul className={styles.list} aria-label="Password requirements">
      {checks.map(({ id, label, passed }) => (
        <li key={id} className={cx(styles.item, passed && styles.passed)}>
          {passed ? (
            <Check size={14} aria-hidden="true" />
          ) : (
            <Circle size={14} aria-hidden="true" />
          )}
          <span>{label}</span>
          <span className={styles.srOnly}>{passed ? ' (done)' : ' (required)'}</span>
        </li>
      ))}
    </ul>
  );
}
