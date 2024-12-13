import React, { useState, useEffect } from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import config from './config.json'; // Ensure you have this if you're using it

export default function Dashboard(props) {
    const [overviewDisasters, setOverviewDisasters] = useState([]);
    const [isLoadingOverview, setIsLoadingOverview] = useState(false);
    const [hasErrorOverview, setHasErrorOverview] = useState(false);

    const [analyticsDisasters, setAnalyticsDisasters] = useState([]);
    const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
    const [hasErrorAnalytics, setHasErrorAnalytics] = useState(false);

    const [mostAffectedLocations, setMostAffectedLocations] = useState([]);
    const [affectedPropertiesPastTwoYears, setAffectedPropertiesPastTwoYears] = useState([]);
    const [propertiesNoDisasterHighRisk, setPropertiesNoDisasterHighRisk] = useState([]);
    const [isLoadingMostAffected, setIsLoadingMostAffected] = useState(false);
    const [hasErrorMostAffected, setHasErrorMostAffected] = useState(false);

    const [showOverview, setShowOverview] = useState([false, false, false]);
    const [showAnalytics, setShowAnalytics] = useState([false, false, false]);

    const fetchOverviewData = (index) => {
        // Reset all other button states except the clicked one
        const updatedShowOverview = showOverview.map((_, i) => i === index);
        setShowOverview(updatedShowOverview);
    
        // Clear data if the same button is clicked again
        if (showOverview[index]) {
            if (index === 1) {
                setAffectedPropertiesPastTwoYears([]);
            } else if (index === 2) {
                setPropertiesNoDisasterHighRisk([]);
            } else {
                setMostAffectedLocations([]);
            }
            updatedShowOverview[index] = false;
            setShowOverview(updatedShowOverview);
            return;
        }
    
        // Start loading the data for the selected button
        setIsLoadingMostAffected(true);
        setHasErrorMostAffected(false);
    
        const endpoint =
            index === 1
                ? "/affected-properties-past-two-years"
                : index === 2
                ? "/recently-unimpacted-high-risk-areas"
                : "/most-affected-properties";

        fetch(`http://${config.server_host}:${config.server_port}${endpoint}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Overview API Response:", data);
                if (index === 1) {
                    setAffectedPropertiesPastTwoYears(data.rows || []);
                } else if (index === 2) {
                    setPropertiesNoDisasterHighRisk(data.rows || []);
                } else {
                    setMostAffectedLocations(data.rows || []);
                }
                setIsLoadingMostAffected(false);
            })
            .catch((error) => {
                console.error("Error fetching data for Overview:", error);
                setHasErrorMostAffected(true);
                setIsLoadingMostAffected(false);
            });
    };

    const fetchAnalyticsData = (index) => {
        const updatedShowAnalytics = [...showAnalytics];
        if (updatedShowAnalytics[index] || isLoadingAnalytics) {
            setAnalyticsDisasters([]);
            updatedShowAnalytics[index] = false;
            setShowAnalytics(updatedShowAnalytics);
            setIsLoadingAnalytics(false);
            return;
        }

        setIsLoadingAnalytics(true);
        setHasErrorAnalytics(false);

        fetch(`http://${config.server_host}:${config.server_port}/frequent-disaster-high-price-properties`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Analytics API Response:', data);
                setAnalyticsDisasters(data);
                setIsLoadingAnalytics(false);
                updatedShowAnalytics[index] = true;
                setShowAnalytics(updatedShowAnalytics);
            })
            .catch(error => {
                console.error('Error fetching data for Analytics:', error);
                setHasErrorAnalytics(true);
                setIsLoadingAnalytics(false);
            });
    };

    return (
        <div className="Dashboard">
            <PageNavbar active="Dashboard" />
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <br />
				<div className="introduction">
                    <h1>Welcome to StormHaven!</h1>
                    <p>Discover Your Next Home with Confidence. Safe Haven Realty is your premier destination for finding properties tailored to your lifestyle while navigating disaster risks. Explore, compare, and secure your future home with insights into disaster risks and real-time data visualization.</p>
                </div>
                {/* Overview Section */}
                <div className="section" style={{ textAlign: 'center', width: '100%' }}>
                    <h2 style={{ textAlign: 'center' }}>Overview</h2>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        {[0, 1, 2].map(index => (
                            <button
                                key={index}
                                className="btn btn-primary"
                                onClick={() => fetchOverviewData(index)}
                                style={{ marginBottom: '10px' }}
                            >
                                {index === 1 ? 'Affected in Past 2 Years' : index === 2 ? 'Properties w/ No Disaster in High Risk Areas' : '20 Most Disaster-Affected Locations'}
                            </button>
                        ))}
                    </div>
                    {isLoadingMostAffected ? (
                        <p>Loading...</p>
                    ) : hasErrorMostAffected ? (
                        <p>Error loading data. Please try again.</p>
                    ) : (
                        showOverview[0] && mostAffectedLocations.length > 0 && (
                            <div style={{ textAlign: 'center' }}>
                                <p>20 Most Affected Locations:</p>
                                <ul style={{ display: 'inline-block', textAlign: 'left' }}>
                                    {mostAffectedLocations.map((location, index) => (
                                        <li key={index}>
                                            {location.city}, {location.state} - {location.county_name} ({location.affected_properties} affected properties)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    )}
                    {showOverview[1] && affectedPropertiesPastTwoYears.length > 0 && (
                        <div style={{ textAlign: 'center' }}>
                            <p>Affected Properties in the Past 2 Years:</p>
                            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid black', padding: '8px' }}>Property ID</th>
                                        <th style={{ border: '1px solid black', padding: '8px' }}>City</th>
                                        <th style={{ border: '1px solid black', padding: '8px' }}>State</th>
                                        <th style={{ border: '1px solid black', padding: '8px' }}>Designated Date</th>
                                        <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {affectedPropertiesPastTwoYears.map((property, index) => (
                                        <tr key={index}>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{property.property_id}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{property.city}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{property.state}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{property.designateddate}</td>
                                            <td style={{ border: '1px solid black', padding: '8px' }}>{property.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {showOverview[2] && propertiesNoDisasterHighRisk.length > 0 && (
    <div style={{ textAlign: 'center' }}>
        <p>Properties w/ No Disaster in High Risk Areas:</p>
        <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Property ID</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>City</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>State</th>
                </tr>
            </thead>
            <tbody>
                {propertiesNoDisasterHighRisk.map((property, index) => (
                    <tr key={index}>
                        <td style={{ border: '1px solid black', padding: '8px' }}>{property.property_id}</td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>{property.city}</td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>{property.state}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}
                </div>

                <br />

                {/* Analytics Section */}
                <div className="section" style={{ textAlign: 'center', width: '100%' }}>
                    <h2 style={{ textAlign: 'center' }}>Analytics</h2>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        {[0, 1, 2].map(index => (
                            <button
                                key={index}
                                className="btn btn-primary"
                                onClick={() => fetchAnalyticsData(index)}
                                style={{ marginBottom: '10px' }}
                            >
                                Most Frequent Disaster Type
                            </button>
                        ))}
                    </div>
                    {isLoadingAnalytics ? (
                        <p>Loading...</p>
                    ) : hasErrorAnalytics ? (
                        <p>Error loading data. Please try again.</p>
                    ) : (
                        analyticsDisasters.length > 0 && (
                            <div style={{ textAlign: 'center' }}>
                                <p>Most frequent disaster type in high-price areas:</p>
                                <p>Type: {analyticsDisasters[0].type_code}</p>
                                <p>Count: {analyticsDisasters[0].disaster_count}</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

