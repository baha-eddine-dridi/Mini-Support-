import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { readableError } from '../api/client';
import { useAuth } from '../context/AuthContext';

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const isRegister = mode === 'register';

  async function submit(event: FormEvent): Promise<void> {
    event.preventDefault();
    setError('');
    try {
      if (isRegister) await register(name, email, password);
      else await login(email, password);
      navigate('/');
    } catch (err) { setError(readableError(err)); }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">CENTRE D’ASSISTANCE</p>
        <h1>{isRegister ? 'Créer votre compte' : 'Bon retour parmi nous'}</h1>
        <p className="muted">{isRegister ? 'Votre compte sera créé avec le rôle utilisateur.' : 'Connectez-vous pour suivre vos tickets.'}</p>
        <form onSubmit={submit} className="auth-form">
          {isRegister && <label>Nom<input required minLength={2} value={name} onChange={(e) => setName(e.target.value)} /></label>}
          <label>E-mail<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label>Mot de passe<input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {error && <p className="error">{error}</p>}
          <button className="button" type="submit">{isRegister ? 'Créer mon compte' : 'Se connecter'}</button>
        </form>
        <p className="switch-link">{isRegister ? 'Déjà inscrit ?' : 'Pas encore de compte ?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Connexion' : 'Inscription'}</Link></p>
      </div>
    </section>
  );
}

