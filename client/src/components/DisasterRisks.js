import React, { useState, useEffect } from 'react';
import PageNavbar from './PageNavbar';

export default function DisasterRisks() {
	const [disasters, setDisasters] = useState([]);

	useEffect(() => {
		// Fetch disaster data from the server.
		fetch('http://localhost:8081/disaster-risks', {
			method: 'GET',
		})
			.then(res => res.json())
			.then(data => {
				let disasterDivs = data.map((disaster, i) => (
					<div key={i} className="disaster">
						<div>{disaster.type_description}</div>
						<div>Date: {disaster.designated_date}</div>
						<div>State: {disaster.state}</div>
					</div>
				));
				setDisasters(disasterDivs);
			})
			.catch(err => console.log(err));
	}, []);

	return (
		<div className="DisasterRisks">
			<PageNavbar active="DisasterRisks" />
			<div className="container">
				<h3>Disaster Risks</h3>
				<div className="results-container">
					{disasters}
				</div>
			</div>
		</div>
	);
}