import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.png'; 

export default function PageNavbar(props) {
    const [navDivs, setNavDivs] = useState([]);

    useEffect(() => {
        const pageList = ['Dashboard', 'FindHouses', 'DisasterRisks'];

        let navbarDivs = pageList.map((page, i) => {
            return (
                <a className={`nav-item nav-link ${props.active === page ? "active" : ""}`} key={i} href={"/" + page}>
                    {page.charAt(0).toUpperCase() + page.substring(1)}
                </a>
            );
        });

        setNavDivs(navbarDivs);
    }, [props.active]);

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