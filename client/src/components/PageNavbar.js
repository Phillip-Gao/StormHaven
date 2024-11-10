import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PageNavbar(props) {
	const [navDivs, setNavDivs] = useState([]);

	useEffect(() => {
		const pageList = ['Dashboard', 'FindFriends'];

		let navbarDivs = pageList.map((page, i) => {
			if (props.active === page) {
				return (
					<a className="nav-item nav-link active" key={i} href={"/" + page}>
						{page.charAt(0).toUpperCase() + page.substring(1, page.length)}
					</a>
				)
			} else {
				return (
					<a className="nav-item nav-link" key={i} href={"/" + page}>
						{page.charAt(0).toUpperCase() + page.substring(1, page.length)}
					</a>
				)
			}
		})

		setNavDivs(navbarDivs);

	}, [])


	return (
		<div className="PageNavbar">
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				<span className="navbar-brand center">CIS550 Exercise 3</span>
				<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
					<div className="navbar-nav">
						{navDivs}
					</div>
				</div>
			</nav>
		</div>
	);

}