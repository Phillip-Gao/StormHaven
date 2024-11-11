import React, { useState } from 'react';
import PageNavbar from './PageNavbar';

export default function PropertySearch() {
	const [properties, setProperties] = useState([]);

	const fetchProperties = () => {
		// Make a request to the server with filters (add query parameters as needed).
		fetch('http://localhost:8081/property-search', {
			method: 'GET',
		})
			.then(res => res.json())
			.then(data => {
				let propertyDivs = data.map((property, i) => (
					<div key={i} className="property">
						<div>{property.city}, {property.state_code}</div>
						<div>Price: ${property.price}</div>
						<div>Bedrooms: {property.bedrooms}, Bathrooms: {property.bathrooms}</div>
					</div>
				));
				setProperties(propertyDivs);
			})
			.catch(err => console.log(err));
	};

	return (
		<div className="PropertySearch">
			<PageNavbar active="PropertySearch" />
			<div className="container">
				<h3>Property Search</h3>
				<button onClick={fetchProperties}>Search Properties</button>
				<div className="results-container">
					{properties}
				</div>
			</div>
		</div>
	);
}
