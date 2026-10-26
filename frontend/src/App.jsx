import { Routes, Route} from 'react-router-dom'



import SignupPage from './pages/SignupPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import CustomerDashboard from'./pages/CustomerDashboard.jsx'
import RestaurantDetails from './pages/RestuarantDetails.jsx'
import BookingPage from './pages/BookingPage.jsx'
import BookingConfirmation from './pages/BookingConfirmation.jsx'
import RestaurantDashboard from './pages/RestaurantDashboard.jsx'
import RestaurantSettingsPage from './pages/RestaurantSettingsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function App(){
    return(
            <Routes>
                <Route path='/' element={<LoginPage/>} />
                <Route path='/signup' element={<SignupPage/>} />
                <Route path="/customer-dashboard" element={<CustomerDashboard />} />
                <Route path="/restaurant/:id" element={<RestaurantDetails />} />
                <Route path='/restaurant-settings' element={<RestaurantSettingsPage/>} />
                <Route path="/booking/:restaurantId" element={<BookingPage />} />
                <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>

    )
}

export default App