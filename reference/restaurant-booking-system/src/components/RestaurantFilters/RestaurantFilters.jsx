import { Search } from 'lucide-react';
import styles from './RestaurantFilters.module.css';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Sort by Rating' },
  { value: 'name', label: 'Sort by Name' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

/**
 * Search box + cuisine / location / sort dropdowns.
 * The parent owns the state (lifting state up): this component only
 * displays `values` and calls onChange(name, value).
 */
export default function RestaurantFilters({ values, onChange, cuisines, locations }) {
  const handle = (name) => (event) => onChange(name, event.target.value);

  return (
    <div className={styles.filters} role="search">
      <div className={styles.searchBox}>
        <Search className={styles.searchIcon} size={20} aria-hidden="true" />
        <input
          type="search"
          className={styles.search}
          placeholder="Search restaurants or cuisine..."
          aria-label="Search restaurants or cuisine"
          value={values.search}
          onChange={handle('search')}
        />
      </div>

      <div className={styles.selects}>
        <select
          className={styles.select}
          aria-label="Filter by cuisine"
          value={values.cuisine}
          onChange={handle('cuisine')}
        >
          <option value="">All Cuisines</option>
          {cuisines.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          aria-label="Filter by location"
          value={values.location}
          onChange={handle('location')}
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          aria-label="Sort restaurants"
          value={values.sortBy}
          onChange={handle('sortBy')}
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
