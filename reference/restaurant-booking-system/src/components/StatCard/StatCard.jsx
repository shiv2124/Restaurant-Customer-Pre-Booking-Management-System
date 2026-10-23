import Card from '../Card/Card';
import styles from './StatCard.module.css';
import { cx } from '../../utils/classNames';

/**
 * A single number with an icon.
 * tone: 'blue' | 'green' | 'yellow' | 'purple'
 * `icon` is a component (e.g. lucide's Calendar), not an element.
 */
export default function StatCard({ icon: Icon, label, value, tone = 'blue' }) {
  return (
    <Card>
      <div className={styles.row}>
        <div className={cx(styles.iconBox, styles[tone])}>
          <Icon size={24} aria-hidden="true" />
        </div>
        <div>
          <p className={styles.label}>{label}</p>
          <p className={styles.value}>{value}</p>
        </div>
      </div>
    </Card>
  );
}
