import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CustomerDashboard.module.css'
import { initialRestaurants } from '../data/restaurants'

function CustomerDashboard() {
  const navigate = useNavigate()

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('')
  const [cuisineFilter, setCuisineFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [sortBy, setSortBy] = useState('rating')

  // Filter and sort computation
  const filteredRestaurants = initialRestaurants
    .filter((restaurant) => {
      const term = searchTerm.toLowerCase().trim()
      // 1. Text search by restaurant name or cuisine
      const matchesSearch =
        !term ||
        restaurant.name.toLowerCase().includes(term) ||
        restaurant.cuisine.toLowerCase().includes(term)

      // 2. Cuisine dropdown filter
      const matchesCuisine = !cuisineFilter || restaurant.cuisine.toLowerCase() === cuisineFilter.toLowerCase()

      // 3. Location dropdown filter
      const matchesLocation = !locationFilter || restaurant.location.toLowerCase() === locationFilter.toLowerCase()

      return matchesSearch && matchesCuisine && matchesLocation
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating // Highest rating first
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name) // Alphabetical A-Z
      }
      return 0
    })

  return (
    <div className={styles.container}>
      {/* Top Navigation Bar */}
      <header className={styles.navbar}>
        <div className={styles.brandGroup}>
          <h2 className={styles.logo}>TableBite</h2>
          <span className={styles.logoDot}></span>
        </div>

        <div className={styles.userMenu}>
          <div className={styles.userBadge}>
            <span className={styles.avatar}>S</span>
            <span>Shiv Patel</span>
          </div>
          <button type="button" className={styles.logoutBtn} onClick={() => navigate('/')}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={styles.main}>
        {/* Hero Title */}
        <div className={styles.heroHeader}>
          <h1 className={styles.heroTitle}>Explore & Book Tables</h1>
          <p className={styles.heroSubtitle}>Discover hand-picked dining experiences in your city</p>
        </div>

        {/* Search & Filter Bar */}
        <section className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by restaurant name or cuisine..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className={styles.filterSelect}
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
          >
            <option value="">All Cuisines</option>
            <option value="indian">Indian</option>
            <option value="italian">Italian</option>
            <option value="chinese">Chinese</option>
            <option value="mexican">Mexican</option>
            <option value="japanese">Japanese</option>
          </select>

          <select
            className={styles.filterSelect}
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="downtown">Downtown</option>
            <option value="uptown">Uptown</option>
            <option value="suburb">Suburb</option>
          </select>

          <select
            className={styles.filterSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Sort by: Top Rated</option>
            <option value="name">Sort by: Name (A-Z)</option>
          </select>
        </section>

        {/* Dynamic Restaurant Cards Grid */}
        <section className={styles.grid}>
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <article key={restaurant.id} className={styles.card}>
                <div className={styles.cardImageContainer}>
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className={styles.cardImage}
                    loading="lazy"
                  />
                  <span className={styles.cuisineBadge}>{restaurant.cuisine}</span>
                  <div className={styles.ratingBadge}>
                    <span className={styles.starIcon}>★</span>
                    <span>{restaurant.rating}</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{restaurant.name}</h3>
                    <span className={styles.priceTag}>
                      {restaurant.priceRange === 'fine' ? '₹₹₹' : restaurant.priceRange === 'moderate' ? '₹₹' : '₹'}
                    </span>
                  </div>

                  <p className={styles.cardLocation}>
                    <span>📍</span> {restaurant.address}
                  </p>

                  <button
                    type="button"
                    className={styles.bookBtn}
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  >
                    Book Table
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>No restaurants found matching "{searchTerm}"</h3>
              <p className={styles.emptyText}>Try searching another cuisine or resetting your filters.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default CustomerDashboard
