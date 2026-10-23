// One place for every URL in the app. Pages use these instead of
// hard-coded strings, so renaming a route is a one-line change.

export const ROUTES = {
  LOGIN: '/',
  CUSTOMER_DASHBOARD: '/customer-dashboard',
  RESTAURANT_DETAILS: '/restaurant/:id',
  BOOKING: '/booking/:restaurantId',
  BOOKING_CONFIRMATION: '/booking-confirmation',
  RESTAURANT_DASHBOARD: '/restaurant-dashboard',
};

export const restaurantPath = (id) => `/restaurant/${id}`;
export const bookingPath = (restaurantId) => `/booking/${restaurantId}`;

export const dashboardPathFor = (userType) =>
  userType === 'restaurant'
    ? ROUTES.RESTAURANT_DASHBOARD
    : ROUTES.CUSTOMER_DASHBOARD;
