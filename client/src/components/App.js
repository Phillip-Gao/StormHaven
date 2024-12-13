import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import FindHouses from './FindHouses';
import DisasterRisks from './DisasterRisks';
import Favorites from './Favorites';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
	  primary: {
		light: '#9c9cbc',
		main: '#424e7f',
		dark: '#9ca4bc',
		contrastText: '#fff',
	  }
	},
  });

export let favorites = [];

export function addFavorite (id) {
    if (!favorites.includes(id)) {
        favorites.push(id);
    }
};

export function removeFavorite (id) {
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
    }
};

export default function App() {
	return (
		<div className="App">
			<ThemeProvider theme={theme}>
			<Router>
				<Switch>
					<Route exact path="/" render={() => <Dashboard />} />
					<Route exact path="/Dashboard" render={() => <Dashboard />} />
					<Route path="/FindHouses" render={() => <FindHouses />} />
					<Route path="/DisasterRisks" render={() => <DisasterRisks />} />
					<Route path="/Favorites" render={() => <Favorites/>} />
				</Switch>
			</Router>
			</ThemeProvider>
		</div>
	);
}
