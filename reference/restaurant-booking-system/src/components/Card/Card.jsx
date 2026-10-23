import styles from './Card.module.css';
import { cx } from '../../utils/classNames';

/**
 * White surface with border and shadow.
 * padding: 'none' | 'md' | 'lg'
 */
export default function Card({
  as: Tag = 'div',
  padding = 'md',
  className,
  children,
  ...rest
}) {
  return (
    <Tag className={cx(styles.card, styles[padding], className)} {...rest}>
      {children}
    </Tag>
  );
}
