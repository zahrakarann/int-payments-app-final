import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-toastify';
import './Component.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout'); // call backend logout
      toast.success('Logged out successfully');
      navigate('/login'); // redirect to login
    } catch (err) {
      toast.error(err.response?.data?.message || 'Logout failed');
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">IntBank</div>
      <div className="nav-links">

        <Link 
          to="/login" 
          className={`nav-link ${isActive('/login') ? 'active' : ''}`}
        >
          Login
        </Link>

        {/* Dashboard link */}
        <Link 
          to="/dashboard" 
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          Dashboard
        </Link>

        {/* Logout button */}
        <button 
          onClick={handleLogout} 
          className="nav-link logout-button"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
