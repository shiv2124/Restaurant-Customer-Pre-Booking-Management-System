import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import Container from '../../components/Container/Container';
import FormField from '../../components/FormField/FormField';
import Header from '../../components/Header/Header';
import Notice from '../../components/Notice/Notice';
import TableLayout from '../../components/TableLayout/TableLayout';
import styles from './BookingForm.module.css';
import useForm from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth';
import { PRE_BOOKING_FEE, STORAGE_KEYS } from '../../constants/options';
import { ROUTES, restaurantPath } from '../../constants/routes';
import { getRestaurantById } from '../../data/restaurants';
import { getTables } from '../../data/tables';
import { formatDate } from '../../utils/date';
import { generateBookingId } from '../../utils/id';
import { loadJSON, saveJSON } from '../../utils/storage';
import {
  SPECIAL_REQUESTS_MAX,
  validateCustomerInfo,
  validateTableSelection,
} from '../../utils/validators';

export default function BookingForm() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const restaurant = getRestaurantById(restaurantId);
  // Step-1 choices saved by the restaurant details page.
  const [draft] = useState(() => loadJSON(STORAGE_KEYS.BOOKING_DRAFT));
  const [tables] = useState(getTables);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [tableChecked, setTableChecked] = useState(false);

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: user?.email ?? '',
      phone: '',
      specialRequests: '',
    },
    validate: validateCustomerInfo,
  });

  // No valid step 1 for this restaurant? Go back and collect it.
  if (!restaurant) return <Navigate to={ROUTES.CUSTOMER_DASHBOARD} replace />;
  if (!draft || draft.restaurantId !== restaurant.id) {
    return <Navigate to={restaurantPath(restaurantId)} replace />;
  }

  const selectedTable = tables.find((table) => table.id === selectedTableId);
  const tableError = validateTableSelection(selectedTable, draft.partySize);
  // Show the table error once the user tried to submit, or when the chosen
  // table can't fit the party (so they find out immediately).
  const visibleTableError = tableChecked || selectedTable ? tableError : '';

  const finishBooking = (values) => {
    if (tableError) return;
    saveJSON(STORAGE_KEYS.BOOKING_COMPLETE, {
      ...draft,
      bookingId: generateBookingId(),
      tableId: selectedTable.id,
      tableNumber: selectedTable.number,
      customerInfo: {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        specialRequests: values.specialRequests.trim(),
      },
    });
    navigate(ROUTES.BOOKING_CONFIRMATION);
  };

  const submit = (event) => {
    setTableChecked(true);
    form.handleSubmit(finishBooking)(event);
  };

  return (
    <div className={styles.page}>
      <Header
        backTo={restaurantPath(restaurant.id)}
        backLabel="Back to Restaurant"
        title="Complete Your Booking"
      />

      <Container padded>
        <div className={styles.layout}>
          <Card>
            <h2 className={styles.heading}>Select Your Table</h2>

            <div className={styles.summary}>
              <h3 className={styles.summaryTitle}>Booking Details:</h3>
              <p>Restaurant: {restaurant.name}</p>
              <p>Date: {formatDate(draft.date, { dateStyle: 'full' })}</p>
              <p>Time: {draft.time}</p>
              <p>Party Size: {draft.partySize} {draft.partySize === 1 ? 'person' : 'people'}</p>
              <p>Occasion: {draft.occasion}</p>
            </div>

            <TableLayout
              tables={tables}
              selectedId={selectedTableId}
              onSelect={setSelectedTableId}
            />

            {selectedTable && !tableError && (
              <p className={styles.selected} role="status">
                Selected: Table {selectedTable.number} ({selectedTable.seats} seats,{' '}
                {selectedTable.type})
              </p>
            )}
            {visibleTableError && (
              <p className={styles.tableError} role="alert">
                {visibleTableError}
              </p>
            )}
          </Card>

          <Card>
            <h2 className={styles.heading}>Your Information</h2>

            <form onSubmit={submit} noValidate className={styles.form}>
              <div className={styles.row}>
                <FormField
                  label="First Name"
                  required
                  autoComplete="given-name"
                  {...form.getFieldProps('firstName')}
                />
                <FormField
                  label="Last Name"
                  required
                  autoComplete="family-name"
                  {...form.getFieldProps('lastName')}
                />
              </div>

              <FormField
                label="Email Address"
                type="email"
                required
                autoComplete="email"
                {...form.getFieldProps('email')}
              />

              <FormField
                label="Phone Number"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+91 98765 43210"
                {...form.getFieldProps('phone')}
              />

              <FormField
                label="Special Requests"
                as="textarea"
                rows={4}
                placeholder="Any special dietary requirements, allergies, or other requests..."
                hint={`${form.values.specialRequests.length}/${SPECIAL_REQUESTS_MAX}`}
                {...form.getFieldProps('specialRequests')}
              />

              <Notice tone="info" title="Pre-booking Payment">
                A pre-booking fee of ₹{PRE_BOOKING_FEE} will be charged to secure your
                reservation. This amount will be adjusted against your final bill.
              </Notice>

              <Button type="submit" size="lg" fullWidth>
                Proceed to Payment (₹{PRE_BOOKING_FEE})
              </Button>
            </form>
          </Card>
        </div>
      </Container>
    </div>
  );
}
