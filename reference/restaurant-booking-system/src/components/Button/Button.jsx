import styles from './Button.module.css';
import { cx } from '../../utils/classNames';

/**
 * variant: 'primary' | 'secondary' | 'danger'
 * size:    'sm' | 'md' | 'lg'
 * as:      render as another element/component, e.g. as={Link} to="/"
 */
export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type,
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      type={type ?? (Tag === 'button' ? 'button' : undefined)}
      className={cx(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
