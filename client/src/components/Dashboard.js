import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import config from './config.json';

export default function Dashboard(props) {
	const [pageSize, setPageSize] = useState(10);
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

	const [safestProperties, setSafestProperties] = useState([]);
	const [propertiesWithSignificantDisasters, setPropertiesWithSignificantDisasters] = useState([]);
    const [isLoadingSafestProperties, setIsLoadingSafestProperties] = useState(false);
    const [hasErrorSafestProperties, setHasErrorSafestProperties] = useState(false);

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
		// Reset all analytics states except the clicked one
		const updatedShowAnalytics = [false, false, false];
   		updatedShowAnalytics[index] = !showAnalytics[index];
    	setShowAnalytics(updatedShowAnalytics);
	
		// Clear data if the same button is clicked again to close it
		if (showAnalytics[index]) {
			setAnalyticsDisasters([]);
			return;
		}
	
		setIsLoadingAnalytics(true);
		setHasErrorAnalytics(false);
	
		let endpoint = "";
		switch (index) {
			case 0:
				endpoint = "/frequent-disaster-high-price-properties";
				break;
			case 1:
				endpoint = "/safest-cities-per-state";
				break;
			case 2:
				endpoint = "/properties-with-significant-disasters";
				break;
			default:
				console.error("Unexpected index for analytics data fetching");
				setIsLoadingAnalytics(false);
				return;
		}
	
		fetch(`http://${config.server_host}:${config.server_port}${endpoint}`)
            .then(response => response.json())
            .then(data => {
				if (index === 0) {
					setAnalyticsDisasters(data || []);
                } else if (index === 1) {
                    setSafestProperties(data || []);
                } else {
                    setPropertiesWithSignificantDisasters(data || []);
                }
                setShowAnalytics(showAnalytics.map((v, i) => i === index)); // Update visibility for the current grid
                setIsLoadingAnalytics(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setHasErrorAnalytics(true);
                setIsLoadingAnalytics(false);
            });
	};

    return (
        <Container>
            <PageNavbar active="Dashboard" />
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <br />
				<div className="introduction">
                    <h1>Welcome to StormHaven!</h1>
                    <p>Discover your next home with confidence! StormHaven is your premier destination for finding properties tailored to your lifestyle while navigating disaster risks. Explore, compare, and secure your future home with insights into disaster risks and real-time data visualization.</p>
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
				<h2>Analytics</h2>
				<div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
					<button
						className="btn btn-primary"
						onClick={() => fetchAnalyticsData(0)}
						style={{ marginBottom: '10px' }}
					>
						Frequent Disasters for High Price Properties
					</button>
					<button
						className="btn btn-primary"
						onClick={() => fetchAnalyticsData(1)}
						style={{ marginBottom: '10px' }}
					>
						Safest Cities per State
					</button>
					<button
						className="btn btn-primary"
						onClick={() => fetchAnalyticsData(2)}
						style={{ marginBottom: '10px' }}
					>
						Prices for properties commonly affected by disasters
					</button>
				</div>
				{isLoadingAnalytics ? (
					<p>Loading...</p>
				) : hasErrorAnalytics ? (
					<p>Error loading data. Please try again.</p>
				) : null}
				{showAnalytics[0] && (
					<DataGrid
						rows={analyticsDisasters}
						columns={[
							{ field: 'type_code', headerName: 'Disaster Type', width: 400 },
							{ field: 'disaster_count', headerName: 'Disaster Count', width: 400 }
						]}
						pageSize={5}
						rowsPerPageOptions={[5, 10, 25]}
						autoHeight
						getRowId={(row) => row.type_code}
					/>
				)}
				{showAnalytics[1] && (
					<DataGrid
					rows={safestProperties}
					columns={[
						{ field: 'row_index', headerName: 'Index', width: 200, hide: true },
						{ field: 'county_name', headerName: 'City', width: 300 },
						{ field: 'state', headerName: 'State', width: 300 },
						{ field: 'disaster_count', headerName: 'Disaster Count', width: 200 }
					]}
					pageSize={10}
					rowsPerPageOptions={[5, 10, 25]}
					autoHeight
					getRowId={(row) => row.row_index}
				/>
				)}
				{showAnalytics[2] && (
					<DataGrid
					rows={propertiesWithSignificantDisasters}
					columns={[
						{ field: 'row_index', headerName: 'Index', width: 200 },
						{ field: 'city', headerName: 'City', width: 300 },
						{ field: 'state', headerName: 'State', width: 300 },
						{ field: 'average_price', headerName: 'Average Price', width: 200 }
					]}
					pageSize={10}
					rowsPerPageOptions={[5, 10, 25]}
					autoHeight
					getRowId={(row) => row.row_index}

				/>
				)}
			</div>

                <br />

            </div>
		</Container>
    );
}

