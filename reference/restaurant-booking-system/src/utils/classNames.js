/**
 * Join class names, skipping anything falsy.
 *   cx(styles.card, isActive && styles.active)  ->  "Card_card__x1 Card_active__y2"
 */
export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}
