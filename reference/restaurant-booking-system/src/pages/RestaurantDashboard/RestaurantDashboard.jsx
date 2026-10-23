import { useState } from 'react';
import { Calendar, Clock, Plus, TrendingUp, Users } from 'lucide-react';
import AddReservationModal from '../../components/AddReservationModal/AddReservationModal';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import Container from '../../components/Container/Container';
import FormField from '../../components/FormField/FormField';
import Header from '../../components/Header/Header';
import ReservationCard from '../../components/ReservationCard/ReservationCard';
import StatCard from '../../components/StatCard/StatCard';
import WeeklyOverview from '../../components/WeeklyOverview/WeeklyOverview';
import styles from './RestaurantDashboard.module.css';
import { useAuth } from '../../hooks/useAuth';
import { TOTAL_TABLES } from '../../constants/options';
import { getInitialReservations } from '../../data/reservations';
import { addDays, formatDate, isValidISODate, toISODate, todayISO } from '../../utils/date';

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState(getInitialReservations);
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [showAddReservation, setShowAddReservation] = useState(false);

  const today = todayISO();

  // Cancelled bookings don't count towards any of the numbers below.
  const active = reservations.filter((r) => r.status !== 'cancelled');
  const reservationsOnDate = reservations
    .filter((r) => r.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));
  const activeOnDate = reservationsOnDate.filter((r) => r.status !== 'cancelled');

  const todayCount = active.filter((r) => r.date === today).length;
  const availableTables = Math.max(TOTAL_TABLES - activeOnDate.length, 0);

  const weeklyOverview = Array.from({ length: 7 }, (_, i) => {
    const date = toISODate(addDays(i));
    return { date, count: active.filter((r) => r.date === date).length };
  });

  const updateStatus = (id, status) =>
    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === id ? { ...reservation, status } : reservation,
      ),
    );

  const addReservation = (reservation) => {
    setReservations((current) => [...current, reservation]);
    setSelectedDate(reservation.date); // show the booking that was just added
    setShowAddReservation(false);
  };

  const closeModal = () => setShowAddReservation(false);

  const dateLabel = isValidISODate(selectedDate) ? formatDate(selectedDate) : 'this date';
  const modalDefaultDate =
    isValidISODate(selectedDate) && selectedDate >= today ? selectedDate : today;

  return (
    <div className={styles.page}>
      <Header title="Restaurant Dashboard" welcomeText={`Welcome, ${user.name}!`} showLogout />

      <Container padded>
        <div className={styles.stats}>
          <StatCard icon={Calendar} tone="blue" label="Today's Reservations" value={todayCount} />
          <StatCard icon={TrendingUp} tone="green" label="Total Reservations" value={active.length} />
          <StatCard icon={Users} tone="yellow" label="Available Tables" value={availableTables} />
          <StatCard icon={Clock} tone="purple" label="Peak Hours" value="7-9 PM" />
        </div>

        <div className={styles.main}>
          <Card className={styles.reservations}>
            <div className={styles.listHeader}>
              <h2 className={styles.listTitle}>Reservations</h2>
              <div className={styles.listActions}>
                <FormField
                  label="Reservation date"
                  hideLabel
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
                <Button onClick={() => setShowAddReservation(true)}>
                  <Plus size={16} aria-hidden="true" />
                  Add Reservation
                </Button>
              </div>
            </div>

            {reservationsOnDate.length === 0 ? (
              <div className={styles.empty}>
                <p>No reservations for {dateLabel}.</p>
                <Button variant="secondary" onClick={() => setShowAddReservation(true)}>
                  Add the first one
                </Button>
              </div>
            ) : (
              <div className={styles.list}>
                {reservationsOnDate.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onStatusChange={updateStatus}
                  />
                ))}
              </div>
            )}
          </Card>

          <WeeklyOverview days={weeklyOverview} />
        </div>
      </Container>

      {showAddReservation && (
        <AddReservationModal
          existingReservations={reservations}
          defaultDate={modalDefaultDate}
          onAdd={addReservation}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
