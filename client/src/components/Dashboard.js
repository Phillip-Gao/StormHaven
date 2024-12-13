import React, { useState, useEffect } from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import config from './config.json'; // Ensure you have this if you're using it

export default function Dashboard(props) {
    const [disasters, setDisasters] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Fetch data when the component for Analytics is loaded
    const fetchAnalyticsData = () => {
        setIsLoading(true);
        setHasError(false);

        fetch(`http://${config.server_host}:${config.server_port}/frequent-disaster-high-price-properties`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setDisasters(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setHasError(true);
                setIsLoading(false);
            });
    };

    return (
        <div className="Dashboard">
            <PageNavbar active="Dashboard" />
            <div className="container">
                <br />
                <div className="section">
                    <h2>Overview</h2>
                    <p>Overview content goes here.</p>
                </div>
                <br />
                <div className="section">
                    <h2>Analytics</h2>
                    <button
                        className="btn btn-primary"
                        onClick={fetchAnalyticsData}
                        style={{ marginBottom: '10px' }}
                    >
                        Load Frequent Disasters
                    </button>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : hasError ? (
                        <p>Error loading data. Please try again.</p>
                    ) : (
                        disasters.length > 0 && (
                            <div>
                                <p>Most frequent disaster type in high-price areas:</p>
                                <p>Type: {disasters[0].type_code}</p>
                                <p>Count: {disasters[0].disaster_count}</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
