import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import FormField from '../FormField/FormField';
import styles from './BookingDetailsForm.module.css';
import useForm from '../../hooks/useForm';
import { OCCASIONS, PARTY_SIZES, STORAGE_KEYS } from '../../constants/options';
import { bookingPath } from '../../constants/routes';
import { addDays, generateTimeSlots, toISODate, todayISO } from '../../utils/date';
import { removeItem, saveJSON } from '../../utils/storage';
import { validateBookingDetails } from '../../utils/validators';

/**
 * Step 1 of a booking: date, time, party size and occasion.
 * Saves a draft and moves on to the table-selection page.
 */
export default function BookingDetailsForm({ restaurant }) {
  const navigate = useNavigate();
  const timeSlots = generateTimeSlots(restaurant.openTime, restaurant.closeTime);

  const form = useForm({
    initialValues: {
      date: toISODate(addDays(1)), // default to tomorrow
      time: '',
      partySize: '2',
      occasion: '',
    },
    validate: (values) => validateBookingDetails(values, restaurant),
  });

  const submit = form.handleSubmit((values) => {
    saveJSON(STORAGE_KEYS.BOOKING_DRAFT, {
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      date: values.date,
      time: values.time,
      partySize: Number(values.partySize),
      occasion: values.occasion,
    });
    removeItem(STORAGE_KEYS.BOOKING_COMPLETE); // never show a stale confirmation
    navigate(bookingPath(restaurant.id));
  });

  return (
    <form onSubmit={submit} noValidate>
      <div className={styles.fields}>
        <FormField
          label="Date"
          type="date"
          required
          min={todayISO()}
          {...form.getFieldProps('date')}
        />

        <FormField label="Time" as="select" required {...form.getFieldProps('time')}>
          <option value="">Select Time</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </FormField>

        <FormField label="Party Size" as="select" required {...form.getFieldProps('partySize')}>
          {PARTY_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} {size === 1 ? 'Person' : 'People'}
            </option>
          ))}
        </FormField>

        <FormField label="Occasion" as="select" required {...form.getFieldProps('occasion')}>
          <option value="">Select Occasion</option>
          {OCCASIONS.map((occasion) => (
            <option key={occasion} value={occasion}>
              {occasion}
            </option>
          ))}
        </FormField>
      </div>

      <Button type="submit" size="lg">
        Check Availability &amp; Proceed
      </Button>
    </form>
  );
}
