import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './BookingPage.module.css'

function BookingPage() {
  const navigate = useNavigate()

  // Read reservation draft from step 1 (RestaurantDetails)
  const draft = JSON.parse(sessionStorage.getItem('bookingDraft') || '{}')
  const restaurantName = draft.restaurantName || 'Restaurant'
  const displayDate = draft.date || 'Today'
  const displayTime = draft.time || '07:00 PM'
  const displayGuests = draft.partySize || '2 Guests'
  const displayOccasion = draft.occasion || 'Casual Dining'

  // Table selection state - NO DEFAULT SELECTION
  const [selectedTableId, setSelectedTableId] = useState(null)

  // Guest details state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [requests, setRequests] = useState('')

  // Validation errors
  const [errors, setErrors] = useState({})

  // Format validation helpers
  const isValidEmail = (val) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val.trim())
  const isValidPhone = (val) => /^[0-9]{10}$/.test(val.trim())

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleTableClick = (tableNumber) => {
    setSelectedTableId(tableNumber)
    if (errors.table) {
      setErrors((prev) => ({ ...prev, table: '' }))
    }
  }

  const handleConfirmBooking = (e) => {
    e.preventDefault()
    const newErrors = {}

    // 1. Table selection check - MUST BE EXPLICITLY SELECTED BY USER
    if (!selectedTableId) {
      newErrors.table = 'Please select an available table from the floor plan below to proceed.'
    }

    // 2. First Name
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required.'
    }

    // 3. Last Name
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required.'
    }

    // 4. Email
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.'
    } else if (!isValidEmail(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@example.com).'
    }

    // 5. Phone (10 digits numeric only)
    const trimmedPhone = phone.trim()
    if (!trimmedPhone) {
      newErrors.phone = 'Phone number is required.'
    } else if (!isValidPhone(trimmedPhone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits (no letters or symbols).'
    }

    setErrors(newErrors)

    // Auto-focus / Scroll to first error
    if (newErrors.table) {
      window.scrollTo({ top: 140, behavior: 'smooth' })
      return
    }
    if (newErrors.firstName) {
      document.getElementById('firstName')?.focus()
      return
    }
    if (newErrors.lastName) {
      document.getElementById('lastName')?.focus()
      return
    }
    if (newErrors.email) {
      document.getElementById('email')?.focus()
      return
    }
    if (newErrors.phone) {
      document.getElementById('phone')?.focus()
      return
    }

    // Save full booking details for Confirmation Receipt
    sessionStorage.setItem(
      'bookingConfirmation',
      JSON.stringify({
        ...draft,
        restaurantName,
        date: displayDate,
        time: displayTime,
        partySize: displayGuests,
        occasion: displayOccasion,
        tableId: selectedTableId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: trimmedEmail,
        phone: trimmedPhone,
        requests: requests.trim(),
        bookingId: '#TB-' + Math.floor(10000 + Math.random() * 90000),
      })
    )

    // All valid! Proceed to Confirmation
    navigate('/booking-confirmation')
  }

  return (
    <div className={styles.container}>
      {/* 1. Top Navbar */}
      <header className={styles.navbar}>
        <div className={styles.brandGroup}>
          <h2 className={styles.logo}>TableBite</h2>
          <span className={styles.logoDot}></span>
        </div>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate(`/restaurant/${draft.restaurantId || 1}`)}
        >
          ← Back to Restaurant
        </button>
      </header>

      {/* 2. Booking Summary Strip (Live Data from Step 1) */}
      <div className={styles.summaryBar}>
        <span className={styles.summaryRestaurant}>
          <span>🍽️</span> {restaurantName}
        </span>
        <span className={styles.summaryItem}>📅 {displayDate}</span>
        <span className={styles.summaryItem}>⏰ {displayTime}</span>
        <span className={styles.summaryItem}>👥 {displayGuests}</span>
        <span className={styles.summaryItem}>🎉 {displayOccasion}</span>
      </div>

      {/* 3. Main Booking Content */}
      <main className={styles.main}>
        {/* Floor Plan Section */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Select a Table</h2>
          <p className={styles.sectionSubtitle}>
            Choose your preferred dining spot on the floor plan
          </p>

          {errors.table && (
            <div className={styles.bannerError}>
              ⚠️ {errors.table}
            </div>
          )}

          {/* Legend */}
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.dotAvailable}></span>
              <span>Available</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.dotSelected}></span>
              <span>Selected</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.dotOccupied}></span>
              <span>Occupied</span>
            </div>
          </div>

          {/* Floor Plan Board with 6 Tables */}
          <div className={styles.floorGrid}>
            {/* Table 1: Available */}
            <button
              type="button"
              className={selectedTableId === 1 ? styles.tableSelected : styles.tableBtn}
              onClick={() => handleTableClick(1)}
            >
              <span className={styles.tableNumber}>Table 1</span>
              <span className={styles.tableSeats}>2 Seats • Window Side</span>
              <span
                className={`${styles.tableStatus} ${
                  selectedTableId === 1 ? styles.statusSelected : styles.statusAvailable
                }`}
              >
                {selectedTableId === 1 ? 'Selected' : 'Available'}
              </span>
            </button>

            {/* Table 2: Occupied */}
            <button type="button" className={styles.tableOccupied} disabled>
              <span className={styles.tableNumber}>Table 2</span>
              <span className={styles.tableSeats}>2 Seats • Center</span>
              <span className={`${styles.tableStatus} ${styles.statusOccupied}`}>Occupied</span>
            </button>

            {/* Table 3: Available */}
            <button
              type="button"
              className={selectedTableId === 3 ? styles.tableSelected : styles.tableBtn}
              onClick={() => handleTableClick(3)}
            >
              <span className={styles.tableNumber}>Table 3</span>
              <span className={styles.tableSeats}>4 Seats • Garden View</span>
              <span
                className={`${styles.tableStatus} ${
                  selectedTableId === 3 ? styles.statusSelected : styles.statusAvailable
                }`}
              >
                {selectedTableId === 3 ? 'Selected' : 'Available'}
              </span>
            </button>

            {/* Table 4: Available */}
            <button
              type="button"
              className={selectedTableId === 4 ? styles.tableSelected : styles.tableBtn}
              onClick={() => handleTableClick(4)}
            >
              <span className={styles.tableNumber}>Table 4</span>
              <span className={styles.tableSeats}>4 Seats • Booth</span>
              <span
                className={`${styles.tableStatus} ${
                  selectedTableId === 4 ? styles.statusSelected : styles.statusAvailable
                }`}
              >
                {selectedTableId === 4 ? 'Selected' : 'Available'}
              </span>
            </button>

            {/* Table 5: Available */}
            <button
              type="button"
              className={selectedTableId === 5 ? styles.tableSelected : styles.tableBtn}
              onClick={() => handleTableClick(5)}
            >
              <span className={styles.tableNumber}>Table 5</span>
              <span className={styles.tableSeats}>6 Seats • Family Area</span>
              <span
                className={`${styles.tableStatus} ${
                  selectedTableId === 5 ? styles.statusSelected : styles.statusAvailable
                }`}
              >
                {selectedTableId === 5 ? 'Selected' : 'Available'}
              </span>
            </button>

            {/* Table 6: Occupied */}
            <button type="button" className={styles.tableOccupied} disabled>
              <span className={styles.tableNumber}>Table 6</span>
              <span className={styles.tableSeats}>8 Seats • Large Booth</span>
              <span className={`${styles.tableStatus} ${styles.statusOccupied}`}>Occupied</span>
            </button>
          </div>
        </section>

        {/* Guest Details Form */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Contact Information</h2>
          <p className={styles.sectionSubtitle}>
            Your reservation confirmation and digital receipt will be sent to these details
          </p>

          <form onSubmit={handleConfirmBooking} noValidate>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="firstName" className={styles.label}>First Name *</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="e.g. John"
                  className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                    clearFieldError('firstName')
                  }}
                />
                {errors.firstName && <span className={styles.fieldError}>⚠️ {errors.firstName}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="lastName" className={styles.label}>Last Name *</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="e.g. Doe"
                  className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value)
                    clearFieldError('lastName')
                  }}
                />
                {errors.lastName && <span className={styles.fieldError}>⚠️ {errors.lastName}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>Email Address *</label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearFieldError('email')
                  }}
                />
                {errors.email && <span className={styles.fieldError}>⚠️ {errors.email}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="phone" className={styles.label}>Phone Number (10 digits) *</label>
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
            </div>

            <div className={styles.field}>
              <label htmlFor="requests" className={styles.label}>Special Requests (Optional)</label>
              <textarea
                id="requests"
                placeholder="High chair, quiet corner, dietary allergies, birthday celebration..."
                className={styles.textarea}
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
              />
            </div>

            {/* Deposit Notice Box */}
            <div className={styles.noticeBox} style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
              <strong>💳 Pre-Booking Deposit:</strong> A small refundable deposit of ₹500 is collected
              to secure your table reservation. This amount will be credited in full against your final restaurant dining bill.
            </div>

            <button type="submit" className={styles.confirmBtn}>
              Confirm Reservation & Pay ₹500 →
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

export default BookingPage
