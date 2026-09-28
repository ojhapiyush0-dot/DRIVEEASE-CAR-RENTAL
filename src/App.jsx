import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import BrowseCars from './pages/BrowseCars.jsx';
import CarDetails from './pages/CarDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Booking from './pages/Booking.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Profile from './pages/Profile.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { CARS } from './data/cars.js';
import { fetchCars } from './services/bookingService.js';

export default function App() {
  const [cars, setCars] = useState(CARS);

  useEffect(() => {
    let active = true;
    fetchCars()
      .then((data) => {
        if (active && data.cars?.length) setCars(data.cars);
      })
      .catch(() => {
        if (active) setCars(CARS);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home cars={cars} />} />
          <Route path="/browse" element={<BrowseCars cars={cars} />} />
          <Route path="/cars/:id" element={<CarDetails cars={cars} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Booking cars={cars} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookings cars={cars} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
