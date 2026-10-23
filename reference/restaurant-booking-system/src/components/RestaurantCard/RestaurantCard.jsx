import { Link } from 'react-router-dom';
import { Clock, MapPin, Star } from 'lucide-react';
import styles from './RestaurantCard.module.css';
import { restaurantPath } from '../../constants/routes';

/** One restaurant in the customer dashboard grid. The whole card is a link. */
export default function RestaurantCard({ restaurant }) {
  const { id, name, image, priceRange, cuisine, location, rating, openTime, closeTime } =
    restaurant;

  return (
    <Link to={restaurantPath(id)} className={styles.card}>
      <img src={image} alt="" className={styles.image} loading="lazy" />
      <div className={styles.body}>
        <div className={styles.top}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.price} aria-label={`Price range ${priceRange}`}>
            {priceRange}
          </span>
        </div>

        <p className={styles.cuisine}>{cuisine}</p>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <MapPin size={16} aria-hidden="true" />
            {location}
          </span>
          <span className={styles.metaItem}>
            <Star size={16} className={styles.star} aria-hidden="true" />
            {rating}
          </span>
        </div>

        <div className={styles.hours}>
          <Clock size={16} aria-hidden="true" />
          {openTime} - {closeTime}
        </div>
      </div>
    </Link>
  );
}
