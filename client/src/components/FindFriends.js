import React, { useState } from 'react';
import PageNavbar from './PageNavbar';
import '../style/FindFriends.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FindFriends(props) {

	// State maintained by this React component is the inputted login,
	// and the list of friends of that login.
	const [login, setLogin] = useState("");
	const [foundFriends, setFoundFriends] = useState([]);

	const submitLogin = async (e) => {
		/* ---- Part 2 (FindFriends) ---- */
		fetch(`http://localhost:8081/friends/${login}`, {
			method: "GET"
		})
			.then(res => res.json())
			.then(friendsList => {
				console.log(friendsList); //displays your JSON object in the console
				let friendsDivs = friendsList.map((friend, i) =>
					/* ---- Part 2 (FindFriends) ---- */
					<div key={i} className="friendResults">
						<div className="login">{friend.friend}</div>
						<div className="name">{friend.name}</div>
					</div>
				);

				setFoundFriends(friendsDivs);

			})
			.catch(err => console.log(err));
	}


	return (
		<div className="Recommendations">
			<PageNavbar active="FindFriends" />

			<div className="container recommendations-container">
				<br></br>
				<div className="jumbotron findFriend-headspace">

					<div className="h5">Find Friends</div>

					<div className="input-container">
						<input type='text' placeholder="awest@gmail.com" value={login} onChange={e => setLogin(e.target.value)} id="movieName" className="login-input" />
						{/* ---- Part 2 (FindFriends) ---- */}
						<button id="submitMovieBtn" className="submit-btn" onClick={submitLogin}>Submit</button>

					</div>

					<div className="header-container">
						<div className="headers">
							<div className="header"><strong>Login</strong></div>
							<div className="header"><strong>Name</strong></div>
						</div>
					</div>

					<div className="results-container" id="results">
						{foundFriends}
					</div>

				</div>
			</div>
		</div>
	);
}
