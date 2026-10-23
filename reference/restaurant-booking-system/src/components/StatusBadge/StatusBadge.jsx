import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import styles from './StatusBadge.module.css';
import { cx } from '../../utils/classNames';

const STATUS = {
  confirmed: { label: 'Confirmed', Icon: CheckCircle },
  pending: { label: 'Pending', Icon: AlertCircle },
  cancelled: { label: 'Cancelled', Icon: XCircle },
};

/** status: 'confirmed' | 'pending' | 'cancelled' */
export default function StatusBadge({ status }) {
  const { label, Icon } = STATUS[status] ?? STATUS.pending;

  return (
    <span className={cx(styles.badge, styles[status])}>
      <Icon size={12} aria-hidden="true" />
      {label}
    </span>
  );
}
