import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import FindHouses from './FindHouses';
import DisasterRisks from './DisasterRisks';
import Favorites from './Favorites';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from "@mui/material/styles";

// Define custom MUI theme
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

// Global state for favorites
export let favorites = [];

/**
 * Adds a house ID to the favorites array if not already included.
 * @param {string} id - The unique identifier of a house.
 */
export function addFavorite (id) {
    if (!favorites.includes(id)) {
        favorites.push(id);
    }
};

/**
 * Removes a house ID from the favorites array if it exists.
 * @param {string} id - The unique identifier of a house.
 */
export function removeFavorite (id) {
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
    }
};

/**
 * Main application component with routing and theme provider.
 * Provides routes for different pages.
 */
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
