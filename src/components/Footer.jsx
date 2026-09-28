export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-grid">
        <div>
          <p className="logo footer-logo">
            DRIVE<span>EASE</span>
          </p>
          <p className="muted">Self-drive car rental for Mumbai, Navi Mumbai, and outstation travel.</p>
        </div>
        <div>
          <h3>Contact</h3>
          <p>Andheri East, Mumbai</p>
          <p>+91 22 4000 1800</p>
          <p>hello@driveease.example</p>
        </div>
        <div>
          <h3>Hours</h3>
          <p>Pickup desks: 7:00 – 22:00</p>
          <p>Airport: 24 hours</p>
        </div>
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} DriveEase Car Rental. College capstone project.</p>
    </footer>
  );
}
