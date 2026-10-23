import Card from '../Card/Card';
import styles from './WeeklyOverview.module.css';
import { formatDate } from '../../utils/date';

/** days: [{ date: 'YYYY-MM-DD', count: number }] */
export default function WeeklyOverview({ days }) {
  return (
    <Card>
      <h2 className={styles.title}>Next 7 Days</h2>
      <ul className={styles.list}>
        {days.map(({ date, count }) => (
          <li key={date} className={styles.row}>
            <span className={styles.date}>
              {formatDate(date, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className={styles.count}>
              {count} {count === 1 ? 'booking' : 'bookings'}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
