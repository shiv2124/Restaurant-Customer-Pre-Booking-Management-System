import Button from '../Button/Button';
import StatusBadge from '../StatusBadge/StatusBadge';
import styles from './ReservationCard.module.css';

/** One booking in the restaurant dashboard list. */
export default function ReservationCard({ reservation, onStatusChange }) {
  const {
    id,
    customerName,
    email,
    phone,
    time,
    partySize,
    tableNumber,
    occasion,
    status,
    specialRequests,
  } = reservation;

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div>
          <h3 className={styles.name}>{customerName}</h3>
          <p className={styles.contact}>{email}</p>
          <p className={styles.contact}>{phone}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className={styles.details}>
        <div>
          <span className={styles.key}>Time:</span> {time}
        </div>
        <div>
          <span className={styles.key}>Party:</span> {partySize}{' '}
          {partySize === 1 ? 'person' : 'people'}
        </div>
        <div>
          <span className={styles.key}>Table:</span> {tableNumber}
        </div>
        <div>
          <span className={styles.key}>Occasion:</span> {occasion}
        </div>
      </div>

      {specialRequests && (
        <div className={styles.requests}>
          <span className={styles.requestsLabel}>Special Requests:</span>
          <p className={styles.requestsText}>{specialRequests}</p>
        </div>
      )}

      {status === 'pending' && (
        <div className={styles.actions}>
          <Button size="sm" onClick={() => onStatusChange(id, 'confirmed')}>
            Confirm
          </Button>
          <Button size="sm" variant="danger" onClick={() => onStatusChange(id, 'cancelled')}>
            Cancel
          </Button>
        </div>
      )}
    </article>
  );
}
