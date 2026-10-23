import { addDays, toISODate } from '../utils/date';

// Mock reservations, dated relative to today so the dashboard always has data.
export function getInitialReservations() {
  const today = toISODate();
  const tomorrow = toISODate(addDays(1));

  return [
    {
      id: '1',
      customerName: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      date: today,
      time: '19:00',
      partySize: 4,
      tableNumber: 5,
      occasion: 'Family Gathering',
      status: 'confirmed',
    },
    {
      id: '2',
      customerName: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 87654 32109',
      date: today,
      time: '20:30',
      partySize: 2,
      tableNumber: 3,
      occasion: 'Anniversary',
      status: 'confirmed',
      specialRequests: 'Window seat preferred',
    },
    {
      id: '3',
      customerName: 'Amit Kumar',
      email: 'amit@example.com',
      phone: '+91 76543 21098',
      date: tomorrow,
      time: '18:00',
      partySize: 6,
      tableNumber: 7,
      occasion: 'Birthday Party',
      status: 'pending',
    },
  ];
}
