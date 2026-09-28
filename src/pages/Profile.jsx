import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Account</p>
        <h1>Profile</h1>
        <dl className="profile-dl">
          <div>
            <dt>Name</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{user.phone}</dd>
          </div>
          <div>
            <dt>Account type</dt>
            <dd>{user.role === 'admin' ? 'Admin' : 'Customer'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
