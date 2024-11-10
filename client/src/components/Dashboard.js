import React, {useState, useEffect} from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

export default function Dashboard(props) {

	// The state maintained by this React Component.
	// This component maintains the list of people.
	const [people, setPeople] = useState([])

	// React function that is called when the page load.
	useEffect(() => {
		// Send an HTTP request to the server.
		fetch('http://localhost:8081/people', {
			method: 'GET', // The type of HTTP request.
		})
			.then(res => res.json()) // Convert the response data to a JSON.
			.then(peopleList => {
				// Map each attribute of a person in this.state.people to an HTML element
				let peopleDivs = peopleList.map((person, i) => (
					<div key={i} className='person'>
						<div className='login'>{person.login}</div>
						<div className='name'>{person.name}</div>
						<div className='birthyear'>{person.birthyear}</div>
					</div>
				));

				// Set the state of the person list to the value returned by the HTTP response from the server.
				setPeople(peopleDivs);
			})
			.catch(err => console.log(err))	// Print the error if there is one.
	}, [])


	return (
		<div className='Dashboard'>
			<PageNavbar active='Dashboard' />
			<div className='container people-container'>
				<br></br>
				<div className='jumbotron less-headspace'>
					<div className='people-container'>
						<div className='people-header'>
							<div className='header-lg'>
								<strong>Login</strong>
							</div>
							<div className='header'>
								<strong>Name</strong>
							</div>
							<div className='header'>
								<strong>Birth Year</strong>
							</div>
						</div>
						<div className='results-container' id='results'>
							{people}
						</div>
					</div>
				</div>
			</div>
		</div>
	);

}
