import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

export default function Dashboard(props) {
	return (
		<div className="Dashboard">
			<PageNavbar active="Dashboard" />
			<div className="container">
				<br />

				{/* Overview Section */}
				<div className="section">
					<h2>Overview</h2>
				</div>

				<br />
				<br />

				{/* Analytics Section */}
				<div className="section">
					<h2>Analytics</h2>
				</div>
			</div>
		</div>
	);
}