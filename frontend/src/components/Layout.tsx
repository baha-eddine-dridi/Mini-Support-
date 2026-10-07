import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout(): void {
    logout();
    navigate('/login');
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">Mini Support<span>+</span></Link>
        {user && (
          <div className="account">
            <span>{user.name} <small>{user.role === 'agent' ? 'Agent' : 'Utilisateur'}</small></span>
            <button className="button button-ghost" onClick={handleLogout}>Déconnexion</button>
          </div>
        )}
      </header>
      {children}
    </main>
  );
}

