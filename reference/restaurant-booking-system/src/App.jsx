import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import BookingConfirmation from './pages/BookingConfirmation/BookingConfirmation';
import BookingForm from './pages/BookingForm/BookingForm';
import CustomerDashboard from './pages/CustomerDashboard/CustomerDashboard';
import LoginPage from './pages/LoginPage/LoginPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import RestaurantDashboard from './pages/RestaurantDashboard/RestaurantDashboard';
import RestaurantDetails from './pages/RestaurantDetails/RestaurantDetails';
import { USER_TYPES } from './constants/options';
import { ROUTES } from './constants/routes';

// <BrowserRouter> and <AuthProvider> are set up in main.jsx.
function App() {
  const customerOnly = (page) => (
    <ProtectedRoute role={USER_TYPES.CUSTOMER}>{page}</ProtectedRoute>
  );

  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Customer pages */}
      <Route path={ROUTES.CUSTOMER_DASHBOARD} element={customerOnly(<CustomerDashboard />)} />
      <Route path={ROUTES.RESTAURANT_DETAILS} element={customerOnly(<RestaurantDetails />)} />
      <Route path={ROUTES.BOOKING} element={customerOnly(<BookingForm />)} />
      <Route
        path={ROUTES.BOOKING_CONFIRMATION}
        element={customerOnly(<BookingConfirmation />)}
      />

      {/* Restaurant pages */}
      <Route
        path={ROUTES.RESTAURANT_DASHBOARD}
        element={
          <ProtectedRoute role={USER_TYPES.RESTAURANT}>
            <RestaurantDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
