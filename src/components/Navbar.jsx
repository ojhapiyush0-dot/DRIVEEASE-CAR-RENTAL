import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/Navbar.css';

function firstName(name) {
  return (name || '').trim().split(/\s+/)[0] || 'there';
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate('/');
  }

  function close() {
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo" onClick={close}>
          DRIVE<span>EASE</span>
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`site-nav ${open ? 'is-open' : ''}`}>
          <NavLink to="/" onClick={close} end>
            Home
          </NavLink>
          <NavLink to="/browse" onClick={close}>
            Fleet
          </NavLink>
          <a href="/#how-it-works" onClick={close}>
            How It Works
          </a>
          <a href="/#about" onClick={close}>
            About
          </a>
          {user ? (
            <>
              <span className="nav-hello">Hi, {firstName(user.name)}</span>
              <NavLink to="/bookings" onClick={close}>
                My Bookings
              </NavLink>
              <NavLink to="/profile" onClick={close}>
                Profile
              </NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin" onClick={close}>
                  Admin
                </NavLink>
              )}
              <button type="button" className="nav-logout" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>
                Login
              </NavLink>
              <NavLink to="/register" className="nav-cta" onClick={close}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
