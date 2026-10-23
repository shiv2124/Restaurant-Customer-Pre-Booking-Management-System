import { useState } from 'react';
import Button from '../../components/Button/Button';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';
import RestaurantFilters from '../../components/RestaurantFilters/RestaurantFilters';
import styles from './CustomerDashboard.module.css';
import { useAuth } from '../../hooks/useAuth';
import { getRestaurants } from '../../data/restaurants';

const DEFAULT_FILTERS = { search: '', cuisine: '', location: '', sortBy: 'rating' };

const SORTERS = {
  rating: (a, b) => b.rating - a.rating,
  name: (a, b) => a.name.localeCompare(b.name),
  'price-low': (a, b) => a.priceRange.length - b.priceRange.length,
  'price-high': (a, b) => b.priceRange.length - a.priceRange.length,
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const restaurants = getRestaurants();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const updateFilter = (name, value) =>
    setFilters((current) => ({ ...current, [name]: value }));

  const cuisines = [...new Set(restaurants.map((r) => r.cuisine))];
  const locations = [...new Set(restaurants.map((r) => r.location))];

  const term = filters.search.trim().toLowerCase();
  const visibleRestaurants = restaurants
    .filter(
      (r) => r.name.toLowerCase().includes(term) || r.cuisine.toLowerCase().includes(term),
    )
    .filter((r) => !filters.cuisine || r.cuisine === filters.cuisine)
    .filter((r) => !filters.location || r.location === filters.location)
    .sort(SORTERS[filters.sortBy]);

  return (
    <div className={styles.page}>
      <Header title={`Welcome, ${user.name}!`} showLogout />

      <Container padded>
        <RestaurantFilters
          values={filters}
          onChange={updateFilter}
          cuisines={cuisines}
          locations={locations}
        />

        {visibleRestaurants.length > 0 ? (
          <div className={styles.grid}>
            {visibleRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyText}>No restaurants found matching your criteria.</p>
            <Button variant="secondary" onClick={() => setFilters(DEFAULT_FILTERS)}>
              Clear filters
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
