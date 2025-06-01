import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const navLinkClass = "nav-link text-white";
  const navbarStyle = { 
    position: "sticky", 
    top: "0", 
    zIndex: "100", 
    backgroundColor: "#000000" 
  };
  const brandStyle = { 
    color: "white", 
    fontWeight: "bold" 
  };

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark" 
      style={navbarStyle}
      aria-label="Main navigation"
    >
      <div className="container-fluid">
        <Link 
          to="/" 
          className="navbar-brand d-flex align-items-center" 
          aria-current="page"
        >
          <img 
            src="/lg.png" 
            alt="TastyBite Logo" 
            width="40" 
            height="40" 
            className="d-inline-block align-top me-2"
          />
          <span style={brandStyle}>TastyBite</span>
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div 
          className="collapse navbar-collapse bg-black" 
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/" className={navLinkClass} aria-current="page">Home</Link>
            </li>

            <li className="nav-item">
              <Link to="/my-recipes" className={navLinkClass}>Your Recipe</Link>
            </li>

            <li className="nav-item">
              <Link to="/favorite" className={navLinkClass}>Favourites</Link>
            </li>
          </ul>

          <div className="d-flex">
            {isAuthenticated ? (
              <button 
                className="btn btn-danger" 
                onClick={handleLogout}
                aria-label="Logout"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn btn-primary" aria-label="Login">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};