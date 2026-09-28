import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOCATIONS } from '../data/cars.js';

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Mumbai');
  const [pickup, setPickup] = useState('');

  function submit(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (location) params.set('location', location);
    if (pickup) params.set('pickup', pickup);
    navigate(`/browse?${params.toString()}`);
  }

  return (
    <form className="search-bar" onSubmit={submit}>
      <label>
        Search cars
        <input
          type="search"
          placeholder="Brezza, Creta, City…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <label>
        Pickup city
        <select value={location} onChange={(event) => setLocation(event.target.value)}>
          {LOCATIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label>
        Pickup date
        <input type="date" value={pickup} onChange={(event) => setPickup(event.target.value)} />
      </label>
      <button className="btn btn-gold" type="submit">
        Find cars
      </button>
    </form>
  );
}
