import { Link } from 'react-router-dom';

export function formatInr(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export default function CarCard({ car }) {
  return (
    <article className="car-card">
      <div className="car-card-media">
        <img src={car.image} alt={car.name} />
      </div>
      <div className="car-card-body">
        <p className="eyebrow">{car.category}</p>
        <h3>{car.name}</h3>
        <ul className="car-meta">
          <li>{car.transmission}</li>
          <li>{car.fuel}</li>
          <li>{car.seats} seats</li>
        </ul>
        <p className="car-price">
          {formatInr(car.price)}
          <span>/day</span>
        </p>
        <div className="car-card-actions">
          <Link className="btn btn-ghost" to={`/cars/${car.id}`}>
            View Details
          </Link>
          <Link className="btn btn-gold" to={`/booking?car=${car.id}`}>
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}
