import { useId } from 'react';
import styles from './FormField.module.css';
import { cx } from '../../utils/classNames';

/**
 * Label + control + error message, wired together for accessibility
 * (htmlFor/id, aria-invalid, aria-describedby).
 *
 *   as="input" (default) | "select" | "textarea"
 *
 * `error` is the message to show (empty/undefined = no error).
 * `hideLabel` keeps the label for screen readers but hides it visually.
 * `endAdornment` is an optional element placed inside the right edge of
 * the control (PasswordField uses it for the show/hide button).
 */
export default function FormField({
  label,
  as: Control = 'input',
  error,
  hint,
  required = false,
  hideLabel = false,
  endAdornment,
  className,
  children,
  ...controlProps
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className={cx(styles.label, hideLabel && styles.srOnly)}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>

      <div className={styles.control}>
        <Control
          id={id}
          className={cx(
            styles.input,
            Control === 'textarea' && styles.textarea,
            endAdornment && styles.hasAdornment,
            error && styles.invalid,
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          {...controlProps}
        >
          {Control === 'select' ? children : undefined}
        </Control>
        {endAdornment && <div className={styles.adornment}>{endAdornment}</div>}
      </div>

      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
