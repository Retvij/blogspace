import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, PenSquare, LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand">
          <BookOpen size={24} color="var(--primary)" />
          Blog<span>Space</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/create-post" className="btn btn-sm btn-primary">
                    <PenSquare size={16} /> Write Post
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="nav-link">
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user.name}</span>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-sm btn-outline" title="Sign Out">
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="btn btn-sm btn-outline">
                    <LogIn size={16} /> Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-sm btn-primary">
                    <UserPlus size={16} /> Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
