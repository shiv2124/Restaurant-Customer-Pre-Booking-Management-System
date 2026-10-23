import Button from '../Button/Button';
import FormField from '../FormField/FormField';
import Modal from '../Modal/Modal';
import styles from './AddReservationModal.module.css';
import useForm from '../../hooks/useForm';
import { OCCASIONS, PARTY_SIZES, TOTAL_TABLES } from '../../constants/options';
import { generateId } from '../../utils/id';
import { todayISO } from '../../utils/date';
import { SPECIAL_REQUESTS_MAX, validateReservationForm } from '../../utils/validators';

const TABLE_NUMBERS = Array.from({ length: TOTAL_TABLES }, (_, i) => i + 1);

/**
 * "Add reservation" dialog for the restaurant dashboard.
 *   existingReservations : used to stop double-booking a table
 *   onAdd(reservation)   : called with the new reservation once valid
 *   onClose()            : cancel / Escape / backdrop click
 */
export default function AddReservationModal({
  existingReservations,
  defaultDate,
  onAdd,
  onClose,
}) {
  const form = useForm({
    initialValues: {
      customerName: '',
      email: '',
      phone: '',
      date: defaultDate,
      time: '',
      partySize: '2',
      tableNumber: '1',
      occasion: OCCASIONS[0],
      specialRequests: '',
    },
    validate: (values) => validateReservationForm(values, existingReservations),
  });

  const submit = form.handleSubmit((values) => {
    onAdd({
      id: generateId(),
      customerName: values.customerName.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      date: values.date,
      time: values.time,
      partySize: Number(values.partySize),
      tableNumber: Number(values.tableNumber),
      occasion: values.occasion,
      specialRequests: values.specialRequests.trim() || undefined,
      status: 'confirmed',
    });
  });

  return (
    <Modal title="Add New Reservation" onClose={onClose}>
      <form onSubmit={submit} noValidate className={styles.form}>
        <FormField
          label="Customer Name"
          required
          autoComplete="name"
          {...form.getFieldProps('customerName')}
        />
        <FormField
          label="Email"
          type="email"
          required
          autoComplete="email"
          {...form.getFieldProps('email')}
        />
        <FormField
          label="Phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+91 98765 43210"
          {...form.getFieldProps('phone')}
        />

        <div className={styles.row}>
          <FormField
            label="Date"
            type="date"
            required
            min={todayISO()}
            {...form.getFieldProps('date')}
          />
          <FormField label="Time" type="time" required {...form.getFieldProps('time')} />
        </div>

        <div className={styles.row}>
          <FormField label="Party Size" as="select" required {...form.getFieldProps('partySize')}>
            {PARTY_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </FormField>
          <FormField
            label="Table Number"
            as="select"
            required
            {...form.getFieldProps('tableNumber')}
          >
            {TABLE_NUMBERS.map((number) => (
              <option key={number} value={number}>
                Table {number}
              </option>
            ))}
          </FormField>
        </div>

        <FormField label="Occasion" as="select" {...form.getFieldProps('occasion')}>
          {OCCASIONS.map((occasion) => (
            <option key={occasion} value={occasion}>
              {occasion}
            </option>
          ))}
        </FormField>

        <FormField
          label="Special Requests"
          as="textarea"
          rows={3}
          hint={`${form.values.specialRequests.length}/${SPECIAL_REQUESTS_MAX}`}
          {...form.getFieldProps('specialRequests')}
        />

        <div className={styles.actions}>
          <Button type="submit" fullWidth>
            Add Reservation
          </Button>
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
