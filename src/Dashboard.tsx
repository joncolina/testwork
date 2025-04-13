import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Dashboard.css';
import logoImage from './assets/logo.png';
import PostList from './PostList';


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {}, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    window.dispatchEvent(new Event('storage'));
    navigate('/login'); // Redirect to login after logout
  };

  useEffect(() => {
    // If there is no user logged in, redirect to login
    if (userEmail === null) {
      navigate('/login');
    }
  }, [navigate, userEmail]);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className='sidebar-container'>
          <div className="logo">
             <img src={logoImage} alt="Logo" />
          </div>
          <div className="welcome-message">
            {userEmail && <p>Welcome, {userEmail}!</p>}
          </div>
          <div className="logout-button-container">
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </aside>
      <div className="dashboard-content">
        <PostList/>
      </div>

    </div>
  );
};

export default Dashboard;