import React, {useState, useEffect} from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

export default function Dashboard(props) {

	// The state maintained by this React Component.
	// This component maintains the list of house.
	const [house, setHouse] = useState([])

	// React function that is called when the page load.
	useEffect(() => {
		// Send an HTTP request to the server.
		fetch('http://localhost:8081/house', {
			method: 'GET', // The type of HTTP request.
		})
			.then(res => res.json()) // Convert the response data to a JSON.
			.then(houseList => {
				// Map each attribute of a house in this.state.house to an HTML element
				let houseDivs = houseList.map((house, i) => (
					<div key={i} className='house'>
						<div className='Address'>{house.login}</div>
						<div className='name'>{house.name}</div>
						<div className='birthyear'>{house.birthyear}</div>
					</div>
				));

				// Set the state of the house list to the value returned by the HTTP response from the server.
				setHouse(houseDivs);
			})
			.catch(err => console.log(err))	// Print the error if there is one.
	}, [])


	return (
		<div className='Dashboard'>
			<PageNavbar active='Dashboard' />
			<div className='container house-container'>
				<br></br>
				<div className='jumbotron less-headspace'>
					<div className='house-container'>
						<div className='house-header'>
							<div className='header-lg'>
								<strong>Address</strong>
							</div>
							<div className='header'>
								<strong>Price</strong>
							</div>
							<div className='header'>
								<strong>Status</strong>
							</div>
						</div>
						<div className='results-container' id='results'>
							{house}
						</div>
					</div>
				</div>
			</div>
		</div>
	);

}
