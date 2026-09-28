import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatInr } from '../components/CarCard.jsx';
import { fetchMyBookings } from '../services/bookingService.js';
import '../styles/MyBookings.css';

export default function MyBookings({ cars }) {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [payingBooking, setPayingBooking] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchMyBookings();
        if (!active) return;
        setBookings(data.bookings || []);
        setStatus('success');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load bookings.');
        setStatus('error');
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handlePayment = async (bookingId) => {
    try {
      setPayingBooking(bookingId);
      setError('');

      const response = await fetch(
        'http://localhost:5000/api/payments/create-checkout-session',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            bookingId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to start payment.');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err.message || 'Unable to start payment.');
      setPayingBooking(null);
    }
  };

  if (status === 'loading') {
    return (
      <div className="page-status">
        <p>Loading your bookings…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="page-status">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <header>
        <p className="eyebrow">Your trips</p>
        <h1>My Bookings</h1>
      </header>

      {error && (
        <div className="page-status">
          <p>{error}</p>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings yet.</p>
          <Link className="btn btn-gold" to="/browse">
            Browse Cars
          </Link>
        </div>
      ) : (
        <ul className="booking-list">
          {bookings.map((booking) => {
            const car = cars.find((item) => item.id === booking.carId);
            return (
              <li key={booking._id} className="booking-item">
                {car && (
                  <div className="booking-thumb">
                    <img src={car.image} alt={booking.carName} />
                  </div>
                )}
                <div>
                  <h2>{booking.carName}</h2>
                  <p>
                    {booking.pickupLocation} → {booking.dropoffLocation}
                  </p>
                  <p>
                    Pickup {booking.pickupDate} {booking.pickupTime} · Return {booking.returnDate}{' '}
                    {booking.returnTime}
                  </p>
                  <p>
                    {booking.rentalDays} day{booking.rentalDays > 1 ? 's' : ''} · {formatInr(booking.pricePerDay)}
                    /day · Total {formatInr(booking.totalAmount)}
                  </p>
                  <p className="booking-flags">
                    <span>Status: {booking.status}</span>
                    <span>Payment: {booking.paymentStatus}</span>
                  </p>

                  {booking.paymentStatus !== 'paid' && (
                    <button
                      type="button"
                      className="btn btn-gold"
                      onClick={() => handlePayment(booking._id)}
                      disabled={payingBooking === booking._id}
                    >
                      {payingBooking === booking._id
                        ? 'Opening Payment…'
                        : 'Pay Now'}
                    </button>
                  )}

                  <p className="muted small">
                    Booked {new Date(booking.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}