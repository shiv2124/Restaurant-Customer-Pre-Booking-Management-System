import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './RestaurantDetails.module.css'
import { initialRestaurants } from '../data/restaurants'

function RestaurantDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  // Match the restaurant from data, or fallback to the first one
  const restaurant = initialRestaurants.find((r) => r.id === Number(id)) || initialRestaurants[0]

  // Reservation form state - NO DEFAULT VALUES
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [partySize, setPartySize] = useState('')
  const [occasion, setOccasion] = useState('')

  const [errors, setErrors] = useState({})

  // Minimum date allowed is today
  const todayISO = new Date().toISOString().split('T')[0]

  const handleProceed = (e) => {
    e.preventDefault()
    const newErrors = {}

    // Date validation
    if (!bookingDate) {
      newErrors.bookingDate = 'Please select a reservation date.'
    } else if (bookingDate < todayISO) {
      newErrors.bookingDate = 'Reservation date cannot be in the past.'
    }

    // Time validation
    if (!bookingTime) {
      newErrors.bookingTime = 'Please select a dining time slot.'
    }

    // Party size validation
    if (!partySize) {
      newErrors.partySize = 'Please select the number of guests.'
    }

    setErrors(newErrors)

    if (newErrors.bookingDate) {
      document.getElementById('bookingDate')?.focus()
      return
    }
    if (newErrors.bookingTime) {
      document.getElementById('bookingTime')?.focus()
      return
    }
    if (newErrors.partySize) {
      document.getElementById('partySize')?.focus()
      return
    }

    // Save draft for Booking & Confirmation pages
    sessionStorage.setItem(
      'bookingDraft',
      JSON.stringify({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        date: bookingDate,
        time: bookingTime,
        partySize: partySize,
        occasion: occasion,
      })
    )

    navigate(`/booking/${restaurant.id}`)
  }

  return (
    <div className={styles.container}>
      {/* 1. Top Navigation Bar */}
      <header className={styles.navbar}>
        <div className={styles.brandGroup}>
          <h2 className={styles.logo}>TableBite</h2>
          <span className={styles.logoDot}></span>
        </div>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate('/customer-dashboard')}
        >
          ← Back to Restaurants
        </button>
      </header>

      <div
        className={styles.heroBanner}
        style={{
          backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 60%), url(${restaurant.image})`,
        }}
      >
        <div className={styles.heroContent}>
          <span className={styles.heroCuisineBadge}>{restaurant.cuisine} Cuisine</span>
          <h1 className={styles.heroTitle}>{restaurant.name}</h1>
          <div className={styles.heroMeta}>
            <span className={styles.heroRating}>★ {restaurant.rating}</span>
            <span>•</span>
            <span>{restaurant.reviewsCount || 120} reviews</span>
            <span>•</span>
            <span>{restaurant.priceRange === 'fine' ? 'Fine Dining (₹₹₹)' : restaurant.priceRange === 'moderate' ? 'Moderate (₹₹)' : 'Budget (₹)'}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Content Stack */}
      <main className={styles.main}>
        {/* Info Box */}
        <article className={styles.infoCard}>
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>📍 Location</span>
              <span className={styles.metaValue}>{restaurant.address}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>⏰ Operating Hours</span>
              <span className={styles.metaValue}>{restaurant.openTime}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>📞 Phone Number</span>
              <span className={styles.metaValue}>{restaurant.phone}</span>
            </div>
          </div>

          <h2 className={styles.descriptionTitle}>About {restaurant.name}</h2>
          <p className={styles.descriptionText}>{restaurant.description}</p>
        </article>

        {/* Reserve a Table Form */}
        <section className={styles.bookingCard}>
          <div className={styles.bookingHeader}>
            <h2 className={styles.bookingTitle}>Reserve a Table</h2>
            <p className={styles.bookingSubtitle}>Choose your preferred date, time slot, and party size</p>
          </div>

          <form onSubmit={handleProceed} noValidate>
            <div className={styles.formGrid}>
              {/* 1. Select Date */}
              <div className={styles.field}>
                <label htmlFor="bookingDate" className={styles.label}>
                  Reservation Date *
                </label>
                <input
                  id="bookingDate"
                  type="date"
                  min={todayISO}
                  className={`${styles.input} ${errors.bookingDate ? styles.inputError : ''}`}
                  value={bookingDate}
                  onChange={(e) => {
                    setBookingDate(e.target.value)
                    if (errors.bookingDate) setErrors((prev) => ({ ...prev, bookingDate: '' }))
                  }}
                />
                {errors.bookingDate && (
                  <span className={styles.fieldError}>⚠️ {errors.bookingDate}</span>
                )}
              </div>

              {/* 2. Select Time */}
              <div className={styles.field}>
                <label htmlFor="bookingTime" className={styles.label}>
                  Dining Time Slot *
                </label>
                <select
                  id="bookingTime"
                  className={`${styles.select} ${errors.bookingTime ? styles.inputError : ''}`}
                  value={bookingTime}
                  onChange={(e) => {
                    setBookingTime(e.target.value)
                    if (errors.bookingTime) setErrors((prev) => ({ ...prev, bookingTime: '' }))
                  }}
                >
                  <option value="">-- Select Time Slot --</option>
                  <option value="12:00 PM (Lunch)">12:00 PM (Lunch)</option>
                  <option value="01:00 PM (Lunch)">01:00 PM (Lunch)</option>
                  <option value="02:00 PM (Lunch)">02:00 PM (Lunch)</option>
                  <option value="07:00 PM (Dinner)">07:00 PM (Dinner)</option>
                  <option value="08:00 PM (Dinner)">08:00 PM (Dinner)</option>
                  <option value="09:00 PM (Dinner)">09:00 PM (Dinner)</option>
                </select>
                {errors.bookingTime && (
                  <span className={styles.fieldError}>⚠️ {errors.bookingTime}</span>
                )}
              </div>

              {/* 3. Guests */}
              <div className={styles.field}>
                <label htmlFor="partySize" className={styles.label}>
                  Number of Guests *
                </label>
                <select
                  id="partySize"
                  className={`${styles.select} ${errors.partySize ? styles.inputError : ''}`}
                  value={partySize}
                  onChange={(e) => {
                    setPartySize(e.target.value)
                    if (errors.partySize) setErrors((prev) => ({ ...prev, partySize: '' }))
                  }}
                >
                  <option value="">-- Select Guests --</option>
                  <option value="2 Guests">2 Guests</option>
                  <option value="4 Guests">4 Guests</option>
                  <option value="6 Guests">6 Guests</option>
                  <option value="8+ Guests">8+ Guests</option>
                </select>
                {errors.partySize && (
                  <span className={styles.fieldError}>⚠️ {errors.partySize}</span>
                )}
              </div>

              {/* 4. Occasion */}
              <div className={styles.field}>
                <label htmlFor="occasion" className={styles.label}>
                  Occasion (Optional)
                </label>
                <select
                  id="occasion"
                  className={styles.select}
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                >
                  <option value="">-- Select Occasion (Optional) --</option>
                  <option value="Casual Dining">Casual Dining</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Business Meal">Business Meal</option>
                </select>
              </div>
            </div>

            <button type="submit" className={styles.proceedBtn}>
              Proceed to Select Table →
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

export default RestaurantDetails
