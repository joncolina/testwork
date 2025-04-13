import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import './styles/App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('userEmail') !== null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('userEmail') !== null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />


        <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect to login if no route matches */}
      </Routes>
    </Router>
  );
}

export default App;
