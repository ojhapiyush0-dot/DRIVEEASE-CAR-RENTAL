import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm.jsx';
import BookingSummary from '../components/BookingSummary.jsx';
import { formatInr } from '../components/CarCard.jsx';
import { createBooking } from '../services/bookingService.js';
import { calculateRentalDays, parseDateTime } from '../utils/rental.js';
import '../styles/Booking.css';

const emptyForm = {
  pickupLocation: '',
  dropoffLocation: '',
  pickupDate: '',
  pickupTime: '',
  returnDate: '',
  returnTime: '',
};

export default function Booking({ cars }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const carId = params.get('car') || cars[0]?.id || '';
  const car = cars.find((item) => item.id === carId) || null;
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pickupAt = parseDateTime(form.pickupDate, form.pickupTime);
  const returnAt = parseDateTime(form.returnDate, form.returnTime);
  const rentalDays = pickupAt && returnAt ? calculateRentalDays(pickupAt, returnAt) : 0;
  const totalAmount = car && rentalDays ? rentalDays * car.price : 0;

  const clientError = useMemo(() => {
    if (!form.pickupDate || !form.pickupTime || !form.returnDate || !form.returnTime) return '';
    if (!pickupAt || !returnAt) return 'Enter valid pickup and return dates and times.';
    if (returnAt <= pickupAt) return 'Return must be after pickup. Rental duration cannot be zero.';
    return '';
  }, [form, pickupAt, returnAt]);

  function onChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!car) {
      setError('Select a car first.');
      return;
    }
    if (clientError) {
      setError(clientError);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await createBooking({ carId: car.id, ...form });
      navigate('/bookings', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to create booking.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!cars.length) {
    return <p className="page-status">Loading cars…</p>;
  }

  return (
    <div className="booking-page">
      <header>
        <p className="eyebrow">Booking</p>
        <h1>Reserve {car ? car.name : 'a car'}</h1>
        {car && (
          <p className="muted">
            {car.category} · {formatInr(car.price)}/day ·{' '}
            <Link to="/browse">Change car</Link>
          </p>
        )}
      </header>
      <div className="booking-layout">
        <BookingForm
          form={form}
          onChange={onChange}
          onSubmit={onSubmit}
          submitting={submitting}
          error={error || clientError}
        />
        <BookingSummary car={car} form={form} rentalDays={rentalDays} totalAmount={totalAmount} />
      </div>
    </div>
  );
}
