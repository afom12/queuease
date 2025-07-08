// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Services from './pages/services';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ServiceBooking from './pages/ServiceBooking';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingHistory from './pages/BookingHistory';
import Settings from './pages/Settings';
import MyBookings from './pages/MyBookings';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminNotifications from './pages/AdminNotifications';
import AdminReminders from './pages/AdminReminders';
import QueueBoard from './pages/QueueBoard';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/queue-board" element={<QueueBoard />} />

        {/* Authenticated User Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>

        {/* Dashboard Routes (User Only) */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="home" element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<Profile />} />
          <Route path="book/:serviceId" element={<ServiceBooking />} />
          <Route path="booking-confirmation" element={<BookingConfirmation />} />
          <Route path="booking-history" element={<BookingHistory />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<PrivateRoute adminOnly={true} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/reminders" element={<AdminReminders />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;