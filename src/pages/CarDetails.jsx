import { Link, useParams } from 'react-router-dom';
import { formatInr } from '../components/CarCard.jsx';
import '../styles/CarDetails.css';

export default function CarDetails({ cars }) {
  const { id } = useParams();
  const car = cars.find((item) => item.id === id);

  if (!car) {
    return (
      <div className="page-status">
        <p>Car not found.</p>
        <Link className="btn btn-gold" to="/browse">
          Browse Cars
        </Link>
      </div>
    );
  }

  return (
    <article className="car-details">
      <div className="details-media">
        <img src={car.image} alt={car.name} />
      </div>
      <div className="details-copy">
        <p className="eyebrow">{car.category}</p>
        <h1>{car.name}</h1>
        <p className="details-price">
          {formatInr(car.price)}
          <span>/day</span>
        </p>
        <ul className="details-specs">
          <li>
            <span>Fuel</span>
            {car.fuel}
          </li>
          <li>
            <span>Transmission</span>
            {car.transmission}
          </li>
          <li>
            <span>Seats</span>
            {car.seats}
          </li>
          <li>
            <span>Brand</span>
            {car.brand}
          </li>
        </ul>
        <p>{car.description}</p>
        <h2>Features</h2>
        <ul className="feature-list">
          {car.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <Link className="btn btn-gold" to={`/booking?car=${car.id}`}>
          Book Now
        </Link>
      </div>
    </article>
  );
}
