import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, Hash, Mail, MapPin, Phone, User, Users } from 'lucide-react';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import Notice from '../../components/Notice/Notice';
import styles from './BookingConfirmation.module.css';
import { PRE_BOOKING_FEE, STORAGE_KEYS } from '../../constants/options';
import { ROUTES } from '../../constants/routes';
import { formatDate } from '../../utils/date';
import { loadJSON, removeItem } from '../../utils/storage';

export default function BookingConfirmation() {
  const navigate = useNavigate();
  // Read once, before the first render. The booking is only cleared when the
  // user leaves via the button below, so a page refresh still shows it.
  const [booking] = useState(() => loadJSON(STORAGE_KEYS.BOOKING_COMPLETE));

  if (!booking) return <Navigate to={ROUTES.CUSTOMER_DASHBOARD} replace />;

  const { customerInfo } = booking;

  const backToDashboard = () => {
    removeItem(STORAGE_KEYS.BOOKING_DRAFT);
    removeItem(STORAGE_KEYS.BOOKING_COMPLETE);
    navigate(ROUTES.CUSTOMER_DASHBOARD);
  };

  return (
    <main className={styles.page}>
      <div className={styles.wrapper}>
        <Card padding="lg" className={styles.card}>
          <CheckCircle size={80} className={styles.successIcon} aria-hidden="true" />

          <h1 className={styles.title}>Booking Confirmed!</h1>
          <p className={styles.lead}>
            Thank you for your reservation{booking.restaurantName && ` at ${booking.restaurantName}`}.
            We look forward to serving you!
          </p>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Booking Details</h2>
            <ul className={styles.list}>
              <li className={styles.item}>
                <Hash size={24} className={styles.itemIcon} aria-hidden="true" />
                <strong>Booking ID: {booking.bookingId}</strong>
              </li>
              <li className={styles.item}>
                <Calendar size={24} className={styles.itemIcon} aria-hidden="true" />
                {formatDate(booking.date, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </li>
              <li className={styles.item}>
                <Clock size={24} className={styles.itemIcon} aria-hidden="true" />
                {booking.time}
              </li>
              <li className={styles.item}>
                <Users size={24} className={styles.itemIcon} aria-hidden="true" />
                {booking.partySize} {booking.partySize === 1 ? 'Person' : 'People'}
              </li>
              <li className={styles.item}>
                <MapPin size={24} className={styles.itemIcon} aria-hidden="true" />
                Table {booking.tableNumber} - {booking.occasion}
              </li>
            </ul>
          </section>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Contact Information</h2>
            <ul className={styles.list}>
              <li className={styles.item}>
                <User size={24} className={styles.itemIcon} aria-hidden="true" />
                {customerInfo.firstName} {customerInfo.lastName}
              </li>
              <li className={styles.item}>
                <Mail size={24} className={styles.itemIcon} aria-hidden="true" />
                {customerInfo.email}
              </li>
              <li className={styles.item}>
                <Phone size={24} className={styles.itemIcon} aria-hidden="true" />
                {customerInfo.phone}
              </li>
            </ul>

            {customerInfo.specialRequests && (
              <div className={styles.requests}>
                <h3 className={styles.requestsTitle}>Special Requests:</h3>
                <p className={styles.requestsText}>{customerInfo.specialRequests}</p>
              </div>
            )}
          </section>

          <Notice tone="success" title="Payment Confirmed" className={styles.notice}>
            Pre-booking fee of ₹{PRE_BOOKING_FEE} has been successfully processed. This
            amount will be adjusted against your final bill.
          </Notice>

          <Notice tone="info" title="Important Notes:" className={styles.notice}>
            <ul className={styles.notes}>
              <li>Please arrive 10 minutes before your reservation time</li>
              <li>Your table will be held for 15 minutes past the reservation time</li>
              <li>For any changes or cancellations, please contact the restaurant directly</li>
              <li>A confirmation SMS and email have been sent to you</li>
            </ul>
          </Notice>

          <div className={styles.actions}>
            <Button fullWidth size="lg" onClick={backToDashboard}>
              Back to Dashboard
            </Button>
            <Button fullWidth size="lg" variant="secondary" onClick={() => window.print()}>
              Print Confirmation
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
