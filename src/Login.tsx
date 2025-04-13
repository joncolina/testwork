import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';
import { authenticate } from './authMock';

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate(); // Inicializar useNavigate

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Email inválido');
      return;
    }
    if (!isValidPassword(password)) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      const isAuthenticated = await authenticate(email, password);
      if (isAuthenticated) {
        localStorage.setItem('userEmail', email);
        window.dispatchEvent(new Event('storage'));
        navigate('/dashboard'); // Redireccionar al dashboard
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>APP Test Work | JC</h1>
        <input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" id="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cargando...' : 'Login'}
        </button>
        {error && <div className="error" style={{ color: 'red' }}>{error}</div>}
      </form>
    </div>
  );
};

export default Login;
function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

