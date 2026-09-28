import { formatInr } from './CarCard.jsx';

export default function BookingSummary({ car, form, rentalDays, totalAmount }) {
  if (!car) return null;

  return (
    <aside className="booking-summary">
      <p className="eyebrow">Booking summary</p>
      <h2>Review before you confirm</h2>
      <dl>
        <div>
          <dt>Car</dt>
          <dd>{car.name}</dd>
        </div>
        <div>
          <dt>Pickup location</dt>
          <dd>{form.pickupLocation || '—'}</dd>
        </div>
        <div>
          <dt>Drop-off location</dt>
          <dd>{form.dropoffLocation || '—'}</dd>
        </div>
        <div>
          <dt>Pickup date</dt>
          <dd>{form.pickupDate || '—'}</dd>
        </div>
        <div>
          <dt>Pickup time</dt>
          <dd>{form.pickupTime || '—'}</dd>
        </div>
        <div>
          <dt>Return date</dt>
          <dd>{form.returnDate || '—'}</dd>
        </div>
        <div>
          <dt>Return time</dt>
          <dd>{form.returnTime || '—'}</dd>
        </div>
        <div>
          <dt>Rental days</dt>
          <dd>{rentalDays || '—'}</dd>
        </div>
        <div>
          <dt>Price/day</dt>
          <dd>{formatInr(car.price)}</dd>
        </div>
        <div className="summary-total">
          <dt>Total amount</dt>
          <dd>{rentalDays ? formatInr(totalAmount) : '—'}</dd>
        </div>
      </dl>
      <p className="muted small">Payment stays pending until a gateway is added. No charge is taken here.</p>
    </aside>
  );
}
