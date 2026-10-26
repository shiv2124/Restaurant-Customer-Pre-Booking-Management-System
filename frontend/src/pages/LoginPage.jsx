import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LoginPage.module.css'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  // Manual validation helpers
  const validateEmailFormat = (val) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    return emailRegex.test(val.trim())
  }

  const handleSignIn = (e) => {
    e.preventDefault()
    const newErrors = {}

    // 1. Email validation
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.'
    } else if (!validateEmailFormat(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address (e.g., name@example.com).'
    }

    // 2. Password validation
    if (!password) {
      newErrors.password = 'Password is required.'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.'
    }

    setErrors(newErrors)

    // Auto-focus on first invalid field
    if (newErrors.email) {
      document.getElementById('email')?.focus()
      return
    }
    if (newErrors.password) {
      document.getElementById('password')?.focus()
      return
    }

    // Hardcoded role routing
    if (trimmedEmail.toLowerCase().includes('owner') || trimmedEmail.toLowerCase().includes('restaurant')) {
      navigate('/restaurant-dashboard')
    } else {
      navigate('/customer-dashboard')
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <div className={styles.brand}>
          TableBite
          <span className={styles.brandDot}></span>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Enter your email and password to access your account</p>
        </div>

        <form className={styles.form} onSubmit={handleSignIn} noValidate>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
              }}
            />
            {errors.email && <span className={styles.fieldError}>⚠️ {errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
              }}
            />
            {errors.password && <span className={styles.fieldError}>⚠️ {errors.password}</span>}
          </div>

          <button type="submit" className={styles.submitBtn}>
            Sign In
          </button>
        </form>

        <p className={styles.footerText}>
          Don't have an account?{' '}
          <button type="button" className={styles.linkBtn} onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </p>
      </main>
    </div>
  )
}

export default LoginPage
