import styles from './RestaurantSettingsPage.module.css'
import { useNavigate } from 'react-router-dom'

function RestaurantSettingsPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <div className={styles.navLeft}>
          <div className={styles.brandGroup}>
            <h2 className={styles.logo}>TableBite</h2>
            <span className={styles.logoDot}></span>
          </div>
          <span className={styles.portalBadge}>STAFF PORTAL</span>
        </div>
        <button type="button" className={styles.backBtn} onClick={() => navigate('/restaurant-dashboard')}>
          ← Back to Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Restaurant Profile Settings</h1>
          <p className={styles.pageSubtitle}>Manage your public profile details, operating hours, and dining capacity</p>
        </div>

        <form className={styles.form}>
          {/* Section 1: Basic Information */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>

            <div className={styles.field}>
              <label htmlFor="restaurantName" className={styles.label}>Restaurant Name</label>
              <input id="restaurantName" type="text" defaultValue="Spice Garden" className={styles.input} />
            </div>

            <div className={styles.formRow}>
              <div className={styles.field}>
                <label htmlFor="cuisine" className={styles.label}>Cuisine Type</label>
                <select id="cuisine" className={styles.select} defaultValue="indian">
                  <option value="indian">Indian</option>
                  <option value="italian">Italian</option>
                  <option value="chinese">Chinese</option>
                  <option value="mexican">Mexican</option>
                  <option value="japanese">Japanese</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="priceRange" className={styles.label}>Price Range</label>
                <select id="priceRange" className={styles.select} defaultValue="fine">
                  <option value="budget">₹ Budget</option>
                  <option value="moderate">₹₹ Moderate</option>
                  <option value="fine">₹₹₹ Fine Dining</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="description" className={styles.label}>Restaurant Description</label>
              <textarea
                id="description"
                className={styles.textarea}
                defaultValue="Experience authentic regional Indian cuisine crafted with aromatic spices and fresh local ingredients. Featuring traditional clay-oven delicacies, fragrant biryanis, and contemporary desserts in a warm, welcoming ambience."
              />
            </div>
          </section>

          {/* Section 2: Location & Contact */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Location & Contact</h2>

            <div className={styles.field}>
              <label htmlFor="address" className={styles.label}>Full Address</label>
              <input id="address" type="text" defaultValue="123 Main Street, Downtown" className={styles.input} />
            </div>

            <div className={styles.formRow}>
              <div className={styles.field}>
                <label htmlFor="phone" className={styles.label}>Restaurant Phone</label>
                <input id="phone" type="tel" defaultValue="+91 98765 43210" className={styles.input} />
              </div>
              <div className={styles.field}>
                <label htmlFor="contactEmail" className={styles.label}>Contact Email</label>
                <input id="contactEmail" type="email" defaultValue="info@spicegarden.com" className={styles.input} />
              </div>
            </div>
          </section>

          {/* Section 3: Operating Hours & Capacity */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Operating Hours & Seating Capacity</h2>

            <div className={styles.formRow}>
              <div className={styles.field}>
                <label htmlFor="openTime" className={styles.label}>Opening Time</label>
                <input id="openTime" type="time" defaultValue="11:00" className={styles.input} />
              </div>
              <div className={styles.field}>
                <label htmlFor="closeTime" className={styles.label}>Closing Time</label>
                <input id="closeTime" type="time" defaultValue="22:30" className={styles.input} />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.field}>
                <label htmlFor="totalTables" className={styles.label}>Number of Tables</label>
                <input id="totalTables" type="number" defaultValue="10" className={styles.input} />
              </div>
              <div className={styles.field}>
                <label htmlFor="maxCapacity" className={styles.label}>Max Seating Capacity</label>
                <input id="maxCapacity" type="number" defaultValue="60" className={styles.input} />
              </div>
            </div>
          </section>

          {/* Section 4: Legal & Verification */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Legal & Verification</h2>

            <div className={styles.formRow}>
              <div className={styles.field}>
                <label htmlFor="gst" className={styles.label}>GST Number</label>
                <input id="gst" type="text" defaultValue="22AAAAA0000A1Z5" className={styles.input} />
              </div>
              <div className={styles.field}>
                <label htmlFor="license" className={styles.label}>FSSAI License Number</label>
                <input id="license" type="text" defaultValue="12345678901234" className={styles.input} />
              </div>
            </div>
          </section>

          {/* Admin Approval Notice */}
          <div className={styles.notice}>
            <strong>⚠️ Administrative Review:</strong> Modifications to registered business name, legal address, or license details require verification by TableBite administrators before updates appear publicly.
          </div>

          {/* Action Buttons */}
          <div className={styles.btnGroup}>
            <button type="submit" className={styles.saveBtn}>Save Changes</button>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate('/restaurant-dashboard')}>
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default RestaurantSettingsPage
