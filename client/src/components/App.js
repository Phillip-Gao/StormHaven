import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import FindHouses from './FindHouses';
import DisasterRisks from './DisasterRisks';

export default function App() {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route exact path="/" render={() => <Dashboard />} />
					<Route exact path="/dashboard" render={() => <Dashboard />} />
					<Route path="/FindHouses" render={() => <FindHouses />} />
					<Route path="/DisasterRisks" render={() => <DisasterRisks />} />
				</Switch>
			</Router>
		</div>
	);
}
