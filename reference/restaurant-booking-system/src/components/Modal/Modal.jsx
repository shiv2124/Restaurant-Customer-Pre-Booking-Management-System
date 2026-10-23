import { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

/**
 * Dialog over a dimmed backdrop. Closes on Escape or a click on the
 * backdrop. The parent decides whether it is shown (`{open && <Modal />}`).
 */
export default function Modal({ title, onClose, children }) {
  const dialogRef = useRef(null);

  // Always call the latest onClose without re-running the effect below
  // (re-running it would pull focus out of the field being typed in).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);
    // Move focus into the dialog so keyboard and screen-reader users land in it.
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <h2 id="modal-title" className={styles.title}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
