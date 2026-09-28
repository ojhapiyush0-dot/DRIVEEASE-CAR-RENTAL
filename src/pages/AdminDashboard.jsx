import { useEffect, useState } from 'react';
import { formatInr } from '../components/CarCard.jsx';
import {
  fetchAdminBookings,
  fetchAdminCars,
  fetchAdminStats,
  fetchAdminUsers,
  updateBookingStatus,
} from '../services/bookingService.js';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    const [statsData, usersData, carsData, bookingsData] = await Promise.all([
      fetchAdminStats(),
      fetchAdminUsers(),
      fetchAdminCars(),
      fetchAdminBookings(),
    ]);
    setStats(statsData);
    setUsers(usersData.users || []);
    setCars(carsData.cars || []);
    setBookings(bookingsData.bookings || []);
  }

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await load();
      } catch (err) {
        if (active) setError(err.message || 'Unable to load admin data.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function onStatusChange(id, status) {
    try {
      await updateBookingStatus(id, status);
      await load();
    } catch (err) {
      setError(err.message || 'Unable to update booking.');
    }
  }

  if (loading) {
    return <p className="page-status">Loading admin dashboard…</p>;
  }

  return (
    <div className="admin-page">
      <header>
        <p className="eyebrow">Operations</p>
        <h1>Admin dashboard</h1>
      </header>
      {error && <p className="form-error">{error}</p>}
      {stats && (
        <div className="stat-grid">
          <article>
            <span>Total users</span>
            <strong>{stats.totalUsers}</strong>
          </article>
          <article>
            <span>Total cars</span>
            <strong>{stats.totalCars}</strong>
          </article>
          <article>
            <span>Total bookings</span>
            <strong>{stats.totalBookings}</strong>
          </article>
          <article>
            <span>Pending bookings</span>
            <strong>{stats.pendingBookings}</strong>
          </article>
          <article>
            <span>Confirmed bookings</span>
            <strong>{stats.confirmedBookings}</strong>
          </article>
        </div>
      )}

      <section>
        <h2>Users</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Cars</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td>{car.name}</td>
                  <td>{car.category}</td>
                  <td>{formatInr(car.price)}/day</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Bookings</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Car</th>
                <th>Pickup</th>
                <th>Drop-off</th>
                <th>Dates</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.user}</td>
                  <td>{booking.car}</td>
                  <td>{booking.pickup}</td>
                  <td>{booking.dropoff}</td>
                  <td>
                    {booking.pickupDate} → {booking.returnDate}
                  </td>
                  <td>{formatInr(booking.total)}</td>
                  <td>
                    <select value={booking.status} onChange={(event) => onStatusChange(booking.id, event.target.value)}>
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancelled">cancelled</option>
                      <option value="completed">completed</option>
                    </select>
                  </td>
                  <td>{booking.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
