import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import Container from '../Container/Container';
import styles from './Header.module.css';
import { cx } from '../../utils/classNames';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

/**
 * Top bar used on every signed-in page.
 *
 *  - backTo + backLabel : "← Back" link on the left
 *  - title              : page heading
 *  - welcomeText        : small text before the logout button
 *  - showLogout         : show the logout button
 */
export default function Header({ title, backTo, backLabel, welcomeText, showLogout = false }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.bar}>
          <div className={styles.left}>
            {backTo && (
              <Link to={backTo} className={styles.back}>
                <ArrowLeft size={20} aria-hidden="true" />
                {backLabel}
              </Link>
            )}
            {title && (
              <h1 className={cx(styles.title, backTo && styles.compact)}>{title}</h1>
            )}
          </div>

          {(showLogout || welcomeText) && (
            <div className={styles.right}>
              {welcomeText && <span className={styles.welcome}>{welcomeText}</span>}
              {showLogout && (
                <button type="button" className={styles.logout} onClick={handleLogout}>
                  <LogOut size={20} aria-hidden="true" />
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
