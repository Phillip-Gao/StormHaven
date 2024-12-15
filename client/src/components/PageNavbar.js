import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.png'; 

export default function PageNavbar({ active }) {
  const [navDivs, setNavDivs] = useState([]);

  // Update navigation links dynamically based on the active page
  useEffect(() => {
    const pageList = ['Dashboard', 'FindHouses', 'DisasterRisks', 'Favorites'];

    // Create navigation links with conditional active styling
    const navbarDivs = pageList.map((page, index) => (
      <Link
        className={`nav-item nav-link ${active === page ? "active" : ""}`}
        key={index}
        to={`/${page}`}
      >
        {page.charAt(0).toUpperCase() + page.slice(1)}
      </Link>
    ));

    setNavDivs(navbarDivs);
  }, [active]);

  return (
    <div className="PageNavbar">
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#343c74' }}>
        <Link to="/Dashboard" className="navbar-brand">
          <img src={logo} alt="Storm Haven Logo" style={{ height: '40px' }} />
        </Link>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {navDivs}
          </div>
        </div>
      </nav>
    </div>
  );
}
