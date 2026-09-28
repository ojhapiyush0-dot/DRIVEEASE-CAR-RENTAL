import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import '../styles/Home.css';

const STEPS = [
  { n: '01', title: 'Choose your car', text: 'Browse the fleet by category, fuel, seats and daily price.' },
  { n: '02', title: 'Select your trip', text: 'Set pickup and drop-off separately, with dates and times that match your plan.' },
  { n: '03', title: 'Confirm your booking', text: 'Review the summary, confirm, and find the reservation in My Bookings.' },
];

export default function Home({ cars }) {
  const featured = cars.slice(0, 4);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Mumbai · Navi Mumbai · Outstation</p>
          <h1>Simple car rental, Mumbai & beyond</h1>
          <p className="hero-kicker">Pick a car. Plan the trip.</p>
          <p className="hero-lede">
            Reliable cars, clear daily prices, flexible categories and an easy booking experience for city and
            outstation travel.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-gold" to="/browse">
              Browse Cars
            </Link>
            <a className="btn btn-ghost" href="#how-it-works">
              How it works
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-hidden="true">
          <img src="/images/creta.jpg" alt="" />
          <p>Hyundai Creta · from ₹2,400/day</p>
        </div>
      </section>

      <section className="home-search">
        <h2>Plan a pickup</h2>
        <SearchBar />
      </section>

      <section className="home-featured">
        <div className="section-head">
          <p className="eyebrow">Featured fleet</p>
          <h2>Cars ready for city and highway</h2>
        </div>
        <div className="car-grid">
          {featured.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
        <Link className="text-link" to="/browse">
          View the full fleet →
        </Link>
      </section>

      <section className="how" id="how-it-works">
        <p className="eyebrow">How It Works</p>
        <h2>Three steps to the road</h2>
        <ol className="how-grid">
          {STEPS.map((step) => (
            <li key={step.n}>
              <span>{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="about" id="about">
        <p className="eyebrow">About DriveEase</p>
        <h2>A rental desk built for clear prices</h2>
        <p>
          DriveEase is a college capstone car-rental website for travellers who want a straightforward self-drive
          booking: SUV, sedan or MUV, petrol or diesel, automatic or manual — with pickup across Mumbai, Navi Mumbai,
          Panvel, Thane, Pune and Mumbai Airport.
        </p>
      </section>
    </div>
  );
}
