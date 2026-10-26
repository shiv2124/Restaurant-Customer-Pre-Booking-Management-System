import styles from './RestaurantDashboard.module.css'
import { useNavigate } from 'react-router-dom'

function RestaurantDashboard() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      {/* 1. Top Navbar */}
      <header className={styles.navbar}>
        <div className={styles.navLeft}>
          <div className={styles.brandGroup}>
            <h2 className={styles.logo}>TableBite</h2>
            <span className={styles.logoDot}></span>
          </div>
          <span className={styles.portalBadge}>STAFF PORTAL</span>
        </div>

        <div className={styles.navRight}>
          <span className={styles.restaurantTitle}>Spice Garden (Manager)</span>
          <button
            type="button"
            className={styles.settingsBtn}
            onClick={() => navigate('/restaurant-settings')}
          >
            ⚙️ Settings
          </button>
          <button type="button" className={styles.logoutBtn} onClick={() => navigate('/')}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={styles.main}>
        {/* 2. Date Filter and Add Reservation Button */}
        <section className={styles.controlsBar}>
          <div className={styles.dateFilterGroup}>
            <label htmlFor="resDate">Filter by Date:</label>
            <input id="resDate" type="date" defaultValue="2026-10-30" className={styles.dateInput} />
          </div>
          <button type="button" className={styles.addBtn}>+ Add Walk-In Reservation</button>
        </section>

        {/* 3. 4 Key Stat Cards */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Today's Bookings</p>
            <p className={styles.statValue}>18</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Guests Expected</p>
            <p className={styles.statValue}>64</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Available Tables</p>
            <p className={styles.statValue}>4 <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 500 }}>/ 10</span></p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Expected Peak Hours</p>
            <p className={styles.statValue} style={{ fontSize: '1.25rem', marginTop: '0.4rem', color: '#2563eb' }}>
              7:30 PM - 9:00 PM
            </p>
          </div>
        </section>

        {/* 4. Reservations List */}
        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Reservations (3)</h2>
            <span className={styles.reservationCount}>Showing all for Oct 30, 2026</span>
          </div>

          <div className={styles.reservationList}>
            {/* Reservation 1: Confirmed */}
            <article className={styles.reservationItem}>
              <div className={styles.customerInfo}>
                <h4>John Doe</h4>
                <p className={styles.customerMeta}>+91 98765 43210 • john@example.com</p>
              </div>

              <div className={styles.bookingMeta}>
                <div className={styles.metaBlock}>
                  <strong>Table 4</strong> (4 Guests)
                </div>
                <div className={styles.metaBlock}>
                  ⏰ <strong>07:00 PM</strong> • Birthday
                </div>
              </div>

              <span className={styles.badgeConfirmed}>Confirmed</span>

              <div className={styles.actionGroup}>
                <button type="button" className={styles.cancelBtn}>Cancel</button>
              </div>
            </article>

            {/* Reservation 2: Pending (Needs Confirmation) */}
            <article className={styles.reservationItem}>
              <div className={styles.customerInfo}>
                <h4>Priya Sharma</h4>
                <p className={styles.customerMeta}>+91 91234 56789 • priya@example.com</p>
              </div>

              <div className={styles.bookingMeta}>
                <div className={styles.metaBlock}>
                  <strong>Table 1</strong> (2 Guests)
                </div>
                <div className={styles.metaBlock}>
                  ⏰ <strong>08:30 PM</strong> • Anniversary
                </div>
              </div>

              <span className={styles.badgePending}>Pending Review</span>

              <div className={styles.actionGroup}>
                <button type="button" className={styles.confirmBtn}>Confirm</button>
                <button type="button" className={styles.cancelBtn}>Cancel</button>
              </div>
            </article>

            {/* Reservation 3: Cancelled */}
            <article className={styles.reservationItem}>
              <div className={styles.customerInfo}>
                <h4>Amit Kumar</h4>
                <p className={styles.customerMeta}>+91 98888 77777 • amit@example.com</p>
              </div>

              <div className={styles.bookingMeta}>
                <div className={styles.metaBlock}>
                  <strong>Table 5</strong> (6 Guests)
                </div>
                <div className={styles.metaBlock}>
                  ⏰ <strong>01:00 PM</strong> • Business
                </div>
              </div>

              <span className={styles.badgeCancelled}>Cancelled</span>

              <div className={styles.actionGroup}>
                {/* No actions for cancelled booking */}
              </div>
            </article>
          </div>
        </section>

        {/* 5. Quick Add Reservation Form */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Quick Add Walk-in / Phone Reservation</h2>
          <form>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="staffCustName" className={styles.label}>Customer Name</label>
                <input id="staffCustName" type="text" placeholder="Full Name" className={styles.input} />
              </div>

              <div className={styles.field}>
                <label htmlFor="staffPhone" className={styles.label}>Phone Number</label>
                <input id="staffPhone" type="tel" placeholder="+91 98765 43210" className={styles.input} />
              </div>

              <div className={styles.field}>
                <label htmlFor="staffTime" className={styles.label}>Time</label>
                <select id="staffTime" className={styles.select}>
                  <option value="19:00">07:00 PM</option>
                  <option value="20:00">08:00 PM</option>
                  <option value="21:00">09:00 PM</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="staffTable" className={styles.label}>Assign Table</label>
                <select id="staffTable" className={styles.select}>
                  <option value="1">Table 1 (2 Seats)</option>
                  <option value="3">Table 3 (4 Seats)</option>
                  <option value="5">Table 5 (6 Seats)</option>
                </select>
              </div>
            </div>

            <button type="button" className={styles.saveBtn}>Save Reservation</button>
          </form>
        </section>
      </main>
    </div>
  )
}

export default RestaurantDashboard
