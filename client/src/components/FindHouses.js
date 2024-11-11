import React, { useState } from 'react';
import PageNavbar from './PageNavbar';
import '../style/FindHouses.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FindHouses(props) {

	// State maintained by this React component is the inputted login,
	// and the list of houses
	const [login, setLogin] = useState("");
	const [foundHouses, setFoundHouses] = useState([]);

	const submitLogin = async (e) => {
		/* ---- Part 2 (FindHouses) ---- */
		fetch(`http://localhost:8081/houses/${login}`, {
			method: "GET"
		})
			.then(res => res.json())
			.then(housesList => {
				console.log(housesList); //displays your JSON object in the console
				let housesDivs = housesList.map((house, i) =>
					/* ---- Part 2 (FindHouses) ---- */
					<div key={i} className="houseResults">
						<div className="login">{house.house}</div>
						<div className="name">{house.name}</div>
					</div>
				);

				setFoundHouses(housesDivs);

			})
			.catch(err => console.log(err));
	}


	return (
		<div className="Recommendations">
			<PageNavbar active="FindHouses" />

			<div className="container recommendations-container">
				<br></br>
				<div className="jumbotron findHouse-headspace">

					<div className="h5">Find House</div>

					<div className="input-container">
						<input type='text' placeholder="awest@gmail.com" value={login} onChange={e => setLogin(e.target.value)} id="movieName" className="login-input" />
						{/* ---- Part 2 (FindHouses) ---- */}
						<button id="submitMovieBtn" className="submit-btn" onClick={submitLogin}>Submit</button>

					</div>

					<div className="header-container">
						<div className="headers">
							<div className="header"><strong>Login</strong></div>
							<div className="header"><strong>Name</strong></div>
						</div>
					</div>

					<div className="results-container" id="results">
						{foundHouses}
					</div>

				</div>
			</div>
		</div>
	);
}
