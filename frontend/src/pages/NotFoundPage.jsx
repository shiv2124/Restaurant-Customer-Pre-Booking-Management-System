import styles from './NotFoundPage.module.css'
import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <main className={styles.card}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.subtitle}>
          Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        <button type="button" className={styles.homeBtn} onClick={() => navigate('/')}>
          ← Return to Home
        </button>
      </main>
    </div>
  )
}

export default NotFoundPage
