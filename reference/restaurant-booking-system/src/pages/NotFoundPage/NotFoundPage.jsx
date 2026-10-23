import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import styles from './NotFoundPage.module.css';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES, dashboardPathFor } from '../../constants/routes';

/** Shown for any URL that doesn't match a route. */
export default function NotFoundPage() {
  const { user } = useAuth();
  const home = user ? dashboardPathFor(user.userType) : ROUTES.LOGIN;

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>The page you are looking for doesn&apos;t exist or has moved.</p>
      <Button as={Link} to={home}>
        {user ? 'Go to your dashboard' : 'Go to sign in'}
      </Button>
    </main>
  );
}
