import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import FindHouses from './FindHouses';
import DisasterRisks from './DisasterRisks';
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


export default function App() {
	return (
		<div className="App">
			<ThemeProvider theme={theme}>
			<Router>
				<Switch>
					<Route exact path="/" render={() => <Dashboard />} />
					<Route exact path="/dashboard" render={() => <Dashboard />} />
					<Route path="/FindHouses" render={() => <FindHouses />} />
					<Route path="/DisasterRisks" render={() => <DisasterRisks />} />
				</Switch>
			</Router>
			</ThemeProvider>
		</div>
	);
}
