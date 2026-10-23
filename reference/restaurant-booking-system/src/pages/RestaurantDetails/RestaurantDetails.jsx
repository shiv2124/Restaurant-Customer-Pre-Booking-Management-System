import { Link, useParams } from 'react-router-dom';
import { Clock, MapPin, Star } from 'lucide-react';
import BookingDetailsForm from '../../components/BookingDetailsForm/BookingDetailsForm';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import styles from './RestaurantDetails.module.css';
import { ROUTES } from '../../constants/routes';
import { getRestaurantById } from '../../data/restaurants';

export default function RestaurantDetails() {
  const { id } = useParams();
  const restaurant = getRestaurantById(id);

  if (!restaurant) {
    return (
      <div className={styles.page}>
        <Header backTo={ROUTES.CUSTOMER_DASHBOARD} backLabel="Back to Restaurants" />
        <Container padded>
          <Card className={styles.notFound}>
            <h1 className={styles.notFoundTitle}>Restaurant not found</h1>
            <p className={styles.notFoundText}>
              We couldn&apos;t find the restaurant you were looking for.
            </p>
            <Button as={Link} to={ROUTES.CUSTOMER_DASHBOARD}>
              Browse restaurants
            </Button>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header backTo={ROUTES.CUSTOMER_DASHBOARD} backLabel="Back to Restaurants" />

      <Container padded>
        <Card padding="none" className={styles.info}>
          <img src={restaurant.imageLarge} alt={restaurant.name} className={styles.image} />
          <div className={styles.infoBody}>
            <div className={styles.titleRow}>
              <div>
                <h1 className={styles.name}>{restaurant.name}</h1>
                <p className={styles.description}>{restaurant.description}</p>
              </div>
              <span className={styles.price} aria-label={`Price range ${restaurant.priceRange}`}>
                {restaurant.priceRange}
              </span>
            </div>

            <ul className={styles.facts}>
              <li className={styles.fact}>
                <MapPin size={20} className={styles.factIcon} aria-hidden="true" />
                {restaurant.address}
              </li>
              <li className={styles.fact}>
                <Star size={20} className={styles.star} aria-hidden="true" />
                {restaurant.rating} Rating
              </li>
              <li className={styles.fact}>
                <Clock size={20} className={styles.factIcon} aria-hidden="true" />
                {restaurant.openTime} - {restaurant.closeTime}
              </li>
            </ul>
          </div>
        </Card>

        <Card>
          <h2 className={styles.formTitle}>Make a Reservation</h2>
          {/* key: switching to another restaurant starts with a fresh form */}
          <BookingDetailsForm key={restaurant.id} restaurant={restaurant} />
        </Card>
      </Container>
    </div>
  );
}
