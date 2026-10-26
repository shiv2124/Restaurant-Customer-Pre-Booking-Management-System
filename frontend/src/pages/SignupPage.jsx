import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SignupPage.module.css'

function SignupPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState('customer')

  // Common fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Restaurant-specific fields
  const [restaurantName, setRestaurantName] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [address, setAddress] = useState('')
  const [openTime, setOpenTime] = useState('')
  const [closeTime, setCloseTime] = useState('')
  const [totalTables, setTotalTables] = useState('')
  const [restaurantPhone, setRestaurantPhone] = useState('')
  const [gst, setGst] = useState('')
  const [description, setDescription] = useState('')

  // Field-level error messages
  const [errors, setErrors] = useState({})

  // Format checkers
  const isValidEmail = (val) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val.trim())
  const isValidPhone = (val) => /^[0-9]{10}$/.test(val.trim())

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleSignup = (e) => {
    e.preventDefault()
    const newErrors = {}

    // 1. Full Name
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.'
    }

    // 2. Email
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.'
    } else if (!isValidEmail(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address (e.g., name@example.com).'
    }

    // 3. Phone (10 digits numeric only)
    const trimmedPhone = phone.trim()
    if (!trimmedPhone) {
      newErrors.phone = 'Phone number is required.'
    } else if (!isValidPhone(trimmedPhone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits (no letters or special characters).'
    }

    // 4. Password validation
    if (!password) {
      newErrors.password = 'Password is required.'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.'
    } else if (!/[a-zA-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one letter.'
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = 'Password must contain at least one special character (!@#$%^&*).'
    }

    // 5. Confirm Password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    // 6. Restaurant fields if role is restaurant
    if (role === 'restaurant') {
      if (!restaurantName.trim()) {
        newErrors.restaurantName = 'Restaurant name is required.'
      }
      if (!cuisine) {
        newErrors.cuisine = 'Please select a cuisine type.'
      }
      if (!priceRange) {
        newErrors.priceRange = 'Please select a price range.'
      }
      if (!address.trim()) {
        newErrors.address = 'Full address is required.'
      }
      if (!openTime) {
        newErrors.openTime = 'Opening time is required.'
      }
      if (!closeTime) {
        newErrors.closeTime = 'Closing time is required.'
      }
      if (!totalTables || Number(totalTables) <= 0) {
        newErrors.totalTables = 'Please enter a valid number of tables.'
      }
      const trimmedRestPhone = restaurantPhone.trim()
      if (!trimmedRestPhone) {
        newErrors.restaurantPhone = 'Restaurant phone number is required.'
      } else if (!isValidPhone(trimmedRestPhone)) {
        newErrors.restaurantPhone = 'Restaurant phone must be exactly 10 digits.'
      }
    }

    setErrors(newErrors)

    // Sequence to auto-focus the first invalid input box
    const fieldOrder = [
      'fullName',
      'email',
      'phone',
      'password',
      'confirmPassword',
      'restaurantName',
      'cuisine',
      'priceRange',
      'address',
      'openTime',
      'closeTime',
      'totalTables',
      'restaurantPhone',
    ]

    for (const fieldId of fieldOrder) {
      if (newErrors[fieldId]) {
        document.getElementById(fieldId)?.focus()
        return
      }
    }

    // Success redirect
    if (role === 'restaurant') {
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
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>Select your account type to get started with TableBite</p>
        </div>

        {/* Role Toggle */}
        <div className={styles.roleGroup}>
          <button
            type="button"
            className={role === 'customer' ? styles.roleBtnActive : styles.roleBtn}
            onClick={() => {
              setRole('customer')
              setErrors({})
            }}
          >
            Customer
          </button>
          <button
            type="button"
            className={role === 'restaurant' ? styles.roleBtnActive : styles.roleBtn}
            onClick={() => {
              setRole('restaurant')
              setErrors({})
            }}
          >
            Restaurant Owner
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSignup} noValidate>
          {/* 1. Full Name */}
          <div className={styles.field}>
            <label htmlFor="fullName" className={styles.label}>Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="e.g. John Doe"
              className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
                clearFieldError('fullName')
              }}
            />
            {errors.fullName && <span className={styles.fieldError}>⚠️ {errors.fullName}</span>}
          </div>

          {/* 2. Email */}
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
                clearFieldError('email')
              }}
            />
            {errors.email && <span className={styles.fieldError}>⚠️ {errors.email}</span>}
          </div>

          {/* 3. Phone */}
          <div className={styles.field}>
            <label htmlFor="phone" className={styles.label}>Phone Number (10 digits)</label>
            <input
              id="phone"
              type="tel"
              placeholder="9876543210"
              maxLength={10}
              className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                clearFieldError('phone')
              }}
            />
            {errors.phone && <span className={styles.fieldError}>⚠️ {errors.phone}</span>}
          </div>

          {/* 4. Password */}
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password (8+ characters, letter & symbol)</label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                clearFieldError('password')
              }}
            />
            {errors.password && <span className={styles.fieldError}>⚠️ {errors.password}</span>}
          </div>

          {/* 5. Confirm Password */}
          <div className={styles.field}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                clearFieldError('confirmPassword')
              }}
            />
            {errors.confirmPassword && <span className={styles.fieldError}>⚠️ {errors.confirmPassword}</span>}
          </div>

          {/* ── Restaurant-Only Fields ── */}
          {role === 'restaurant' && (
            <>
              <hr className={styles.divider} />
              <h3 className={styles.sectionLabel}>Restaurant Details</h3>

              <div className={styles.field}>
                <label htmlFor="restaurantName" className={styles.label}>Restaurant Name</label>
                <input
                  id="restaurantName"
                  type="text"
                  placeholder="e.g. Spice Garden"
                  className={`${styles.input} ${errors.restaurantName ? styles.inputError : ''}`}
                  value={restaurantName}
                  onChange={(e) => {
                    setRestaurantName(e.target.value)
                    clearFieldError('restaurantName')
                  }}
                />
                {errors.restaurantName && <span className={styles.fieldError}>⚠️ {errors.restaurantName}</span>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label htmlFor="cuisine" className={styles.label}>Cuisine Type</label>
                  <select
                    id="cuisine"
                    className={`${styles.select} ${errors.cuisine ? styles.inputError : ''}`}
                    value={cuisine}
                    onChange={(e) => {
                      setCuisine(e.target.value)
                      clearFieldError('cuisine')
                    }}
                  >
                    <option value="">Select Cuisine</option>
                    <option value="indian">Indian</option>
                    <option value="italian">Italian</option>
                    <option value="chinese">Chinese</option>
                    <option value="mexican">Mexican</option>
                    <option value="japanese">Japanese</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.cuisine && <span className={styles.fieldError}>⚠️ {errors.cuisine}</span>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="priceRange" className={styles.label}>Price Range</label>
                  <select
                    id="priceRange"
                    className={`${styles.select} ${errors.priceRange ? styles.inputError : ''}`}
                    value={priceRange}
                    onChange={(e) => {
                      setPriceRange(e.target.value)
                      clearFieldError('priceRange')
                    }}
                  >
                    <option value="">Select Price Range</option>
                    <option value="budget">₹ Budget</option>
                    <option value="moderate">₹₹ Moderate</option>
                    <option value="fine">₹₹₹ Fine Dining</option>
                  </select>
                  {errors.priceRange && <span className={styles.fieldError}>⚠️ {errors.priceRange}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="address" className={styles.label}>Full Address</label>
                <input
                  id="address"
                  type="text"
                  placeholder="Street name, landmark, area"
                  className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value)
                    clearFieldError('address')
                  }}
                />
                {errors.address && <span className={styles.fieldError}>⚠️ {errors.address}</span>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label htmlFor="openTime" className={styles.label}>Opening Time</label>
                  <input
                    id="openTime"
                    type="time"
                    className={`${styles.input} ${errors.openTime ? styles.inputError : ''}`}
                    value={openTime}
                    onChange={(e) => {
                      setOpenTime(e.target.value)
                      clearFieldError('openTime')
                    }}
                  />
                  {errors.openTime && <span className={styles.fieldError}>⚠️ {errors.openTime}</span>}
                </div>
                <div className={styles.field}>
                  <label htmlFor="closeTime" className={styles.label}>Closing Time</label>
                  <input
                    id="closeTime"
                    type="time"
                    className={`${styles.input} ${errors.closeTime ? styles.inputError : ''}`}
                    value={closeTime}
                    onChange={(e) => {
                      setCloseTime(e.target.value)
                      clearFieldError('closeTime')
                    }}
                  />
                  {errors.closeTime && <span className={styles.fieldError}>⚠️ {errors.closeTime}</span>}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label htmlFor="totalTables" className={styles.label}>Total Tables</label>
                  <input
                    id="totalTables"
                    type="number"
                    min="1"
                    placeholder="10"
                    className={`${styles.input} ${errors.totalTables ? styles.inputError : ''}`}
                    value={totalTables}
                    onChange={(e) => {
                      setTotalTables(e.target.value)
                      clearFieldError('totalTables')
                    }}
                  />
                  {errors.totalTables && <span className={styles.fieldError}>⚠️ {errors.totalTables}</span>}
                </div>
                <div className={styles.field}>
                  <label htmlFor="restaurantPhone" className={styles.label}>Restaurant Phone</label>
                  <input
                    id="restaurantPhone"
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    className={`${styles.input} ${errors.restaurantPhone ? styles.inputError : ''}`}
                    value={restaurantPhone}
                    onChange={(e) => {
                      setRestaurantPhone(e.target.value)
                      clearFieldError('restaurantPhone')
                    }}
                  />
                  {errors.restaurantPhone && <span className={styles.fieldError}>⚠️ {errors.restaurantPhone}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="gst" className={styles.label}>GST Number (Optional)</label>
                <input
                  id="gst"
                  type="text"
                  placeholder="22AAAAA0000A1Z5"
                  className={styles.input}
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="description" className={styles.label}>Restaurant Description</label>
                <textarea
                  id="description"
                  placeholder="Share a brief overview of your menu, ambience, and specialties..."
                  className={styles.textarea}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className={styles.notice}>
                <strong>ℹ️ Verification Notice:</strong> Restaurant registration details will be verified by the admin team before listings are made public to diners.
              </div>
            </>
          )}

          <button type="submit" className={styles.submitBtn}>
            {role === 'customer' ? 'Create Customer Account' : 'Register Restaurant'}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{' '}
          <button type="button" className={styles.linkBtn} onClick={() => navigate('/')}>
            Sign In
          </button>
        </p>
      </main>
    </div>
  )
}

export default SignupPage
