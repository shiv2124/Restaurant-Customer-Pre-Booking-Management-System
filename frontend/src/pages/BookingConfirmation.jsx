import { useNavigate } from 'react-router-dom'
import styles from './BookingConfirmation.module.css'

function BookingConfirmation() {
  const navigate = useNavigate()

  // Read confirmed booking from sessionStorage
  const booking = JSON.parse(sessionStorage.getItem('bookingConfirmation') || '{}')

  const bookingId = booking.bookingId || '#TB-89421'
  const restaurantName = booking.restaurantName || 'Spice Garden'
  const dateTime = `${booking.date || 'Today'} • ${booking.time || '07:00 PM'}`
  const guestTable = `${booking.partySize || '4 Guests'} • Table ${booking.tableId || 4}`
  const occasion = booking.occasion || 'Casual Dining'
  const customerName = booking.firstName
    ? `${booking.firstName} ${booking.lastName} (${booking.phone})`
    : 'John Doe (+91 98765 43210)'

  return (
    <div className={styles.container}>
      {/* 1. Top Navbar */}
      <header className={styles.navbar}>
        <div className={styles.brandGroup}>
          <h2 className={styles.logo}>TableBite</h2>
          <span className={styles.logoDot}></span>
        </div>
      </header>

      {/* 2. Centered Receipt Card */}
      <main className={styles.main}>
        <article className={styles.card}>
          {/* Success Checkmark & Heading */}
          <div className={styles.successHeader}>
            <div className={styles.checkCircle}>✓</div>
            <h1 className={styles.title}>Reservation Confirmed!</h1>
            <p className={styles.subtitle}>
              Your table has been reserved. A confirmation SMS and digital pass have been issued.
            </p>
            <span className={styles.bookingBadge}>BOOKING ID: {bookingId}</span>
          </div>

          {/* Details Breakdown */}
          <div className={styles.detailsSection}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Restaurant</span>
              <span className={styles.detailValue}>{restaurantName}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Date & Time</span>
              <span className={styles.detailValue}>{dateTime}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Seating & Guests</span>
              <span className={styles.detailValue}>{guestTable}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Occasion</span>
              <span className={styles.detailValue}>{occasion}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Booked Under</span>
              <span className={styles.detailValue}>{customerName}</span>
            </div>
          </div>

          {/* Deposit Payment Summary */}
          <div className={styles.paymentBox}>
            <div>
              <strong>Pre-Booking Deposit Paid:</strong>
              <div style={{ color: '#64748b', fontSize: '0.8125rem' }}>
                Credited toward your final dining check
              </div>
            </div>
            <span className={styles.paidAmount}>₹500.00</span>
          </div>

          {/* Action Buttons */}
          <div className={styles.btnGroup}>
            <button type="button" className={styles.printBtn} onClick={() => window.print()}>
              🖨️ Print Receipt
            </button>
            <button
              type="button"
              className={styles.dashboardBtn}
              onClick={() => navigate('/customer-dashboard')}
            >
              Back to Dashboard →
            </button>
          </div>
        </article>
      </main>
    </div>
  )
}

export default BookingConfirmation
