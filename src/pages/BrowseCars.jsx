import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CarCard from '../components/CarCard.jsx';
import '../styles/BrowseCars.css';

export default function BrowseCars({ cars }) {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [category, setCategory] = useState('');
  const [fuel, setFuel] = useState('');
  const [transmission, setTransmission] = useState('');
  const [seats, setSeats] = useState('');
  const [sort, setSort] = useState('price-asc');

  const categories = [...new Set(cars.map((car) => car.category))];
  const fuels = [...new Set(cars.map((car) => car.fuel))];
  const transmissions = [...new Set(cars.map((car) => car.transmission))];
  const seatOptions = [...new Set(cars.map((car) => car.seats))].sort((a, b) => a - b);

  const filtered = useMemo(() => {
    let list = cars.filter((car) => {
      const haystack = `${car.name} ${car.brand} ${car.model}`.toLowerCase();
      if (query && !haystack.includes(query.toLowerCase())) return false;
      if (category && car.category !== category) return false;
      if (fuel && car.fuel !== fuel) return false;
      if (transmission && car.transmission !== transmission) return false;
      if (seats && String(car.seats) !== seats) return false;
      return true;
    });
    list = [...list].sort((a, b) => (sort === 'price-desc' ? b.price - a.price : a.price - b.price));
    return list;
  }, [cars, query, category, fuel, transmission, seats, sort]);

  function clearFilters() {
    setQuery('');
    setCategory('');
    setFuel('');
    setTransmission('');
    setSeats('');
    setSort('price-asc');
  }

  return (
    <div className="browse">
      <header className="browse-hero">
        <p className="eyebrow">Fleet</p>
        <h1>Choose a car for the journey</h1>
        <p>Filter by how you drive. Daily prices stay on the card — no hidden categories.</p>
      </header>

      <div className="filters">
        <input
          type="search"
          placeholder="Search by car name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search by car name"
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={fuel} onChange={(event) => setFuel(event.target.value)} aria-label="Fuel">
          <option value="">All fuel</option>
          {fuels.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={transmission} onChange={(event) => setTransmission(event.target.value)} aria-label="Transmission">
          <option value="">All transmissions</option>
          {transmissions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={seats} onChange={(event) => setSeats(event.target.value)} aria-label="Seats">
          <option value="">Any seats</option>
          {seatOptions.map((item) => (
            <option key={item} value={item}>
              {item} seats
            </option>
          ))}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort by price">
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
        <button className="btn btn-ghost" type="button" onClick={clearFilters}>
          Clear filters
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="page-status">No cars match those filters.</p>
      ) : (
        <div className="car-grid">
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
