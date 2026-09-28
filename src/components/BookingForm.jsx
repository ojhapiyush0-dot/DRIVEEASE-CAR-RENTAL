import { LOCATIONS } from '../data/cars.js';

export default function BookingForm({ form, onChange, onSubmit, submitting, error }) {
  return (
    <form className="booking-form" onSubmit={onSubmit}>
      <fieldset>
        <legend>Pickup</legend>
        <label>
          Pickup location
          <select name="pickupLocation" value={form.pickupLocation} onChange={onChange} required>
            <option value="">Select pickup</option>
            {LOCATIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <div className="form-row">
          <label>
            Pickup date
            <input type="date" name="pickupDate" value={form.pickupDate} onChange={onChange} required />
          </label>
          <label>
            Pickup time
            <input type="time" name="pickupTime" value={form.pickupTime} onChange={onChange} required />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Return</legend>
        <label>
          Drop-off location
          <select name="dropoffLocation" value={form.dropoffLocation} onChange={onChange} required>
            <option value="">Select drop-off</option>
            {LOCATIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <div className="form-row">
          <label>
            Return date
            <input type="date" name="returnDate" value={form.returnDate} onChange={onChange} required />
          </label>
          <label>
            Return time
            <input type="time" name="returnTime" value={form.returnTime} onChange={onChange} required />
          </label>
        </div>
      </fieldset>

      {error && <p className="form-error">{error}</p>}
      <button className="btn btn-gold" type="submit" disabled={submitting}>
        {submitting ? 'Confirming…' : 'Confirm booking'}
      </button>
    </form>
  );
}
