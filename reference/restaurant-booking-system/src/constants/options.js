export const USER_TYPES = {
  CUSTOMER: 'customer',
  RESTAURANT: 'restaurant',
};

export const OCCASIONS = [
  'Casual Dining',
  'Family Gathering',
  'Friends Meetup',
  'Birthday Party',
  'Anniversary',
  'Candlelight Dinner',
  'Business Meeting',
  'Date Night',
];

export const MAX_PARTY_SIZE = 10;
export const PARTY_SIZES = Array.from({ length: MAX_PARTY_SIZE }, (_, i) => i + 1);

export const TOTAL_TABLES = 20;
export const PRE_BOOKING_FEE = 200;

// How long a party is assumed to occupy a table. Used to stop the same
// table being booked twice at overlapping times.
export const DINING_DURATION_MINUTES = 90;

export const STORAGE_KEYS = {
  USER: 'user',
  BOOKING_DRAFT: 'bookingData',
  BOOKING_COMPLETE: 'completeBookingData',
};
