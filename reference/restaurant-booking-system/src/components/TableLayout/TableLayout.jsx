import { Check } from 'lucide-react';
import styles from './TableLayout.module.css';
import { cx } from '../../utils/classNames';

/** Floor plan with a legend. Tables are buttons, so they work with the keyboard. */
export default function TableLayout({ tables, selectedId, onSelect }) {
  const stateClass = (table) => {
    if (!table.isAvailable) return styles.occupied;
    if (table.id === selectedId) return styles.selected;
    if (table.isRecommended) return styles.recommended;
    return styles.available;
  };

  return (
    <>
      <div className={styles.floor}>
        <div className={styles.plan}>
          {tables.map((table) => {
            const isSelected = table.id === selectedId;
            return (
              <button
                key={table.id}
                type="button"
                className={cx(styles.table, stateClass(table))}
                style={{ left: `${table.position.x}%`, top: `${table.position.y}%` }}
                disabled={!table.isAvailable}
                aria-pressed={isSelected}
                aria-label={`Table ${table.number}, ${table.seats} seats, ${table.type}${
                  table.isAvailable ? '' : ', occupied'
                }`}
                title={`Table ${table.number} - ${table.seats} seats (${table.type})`}
                onClick={() => onSelect(table.id)}
              >
                {table.number}
                {isSelected && <Check size={16} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>

      <ul className={styles.legend}>
        <li className={styles.legendItem}>
          <span className={cx(styles.swatch, styles.recommended)} /> Recommended
        </li>
        <li className={styles.legendItem}>
          <span className={cx(styles.swatch, styles.available)} /> Available
        </li>
        <li className={styles.legendItem}>
          <span className={cx(styles.swatch, styles.selected)} /> Selected
        </li>
        <li className={styles.legendItem}>
          <span className={cx(styles.swatch, styles.occupied)} /> Occupied
        </li>
      </ul>
    </>
  );
}
