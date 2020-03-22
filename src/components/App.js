import React, { useContext } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import 'firebase/firestore'
import { FirebaseContext } from '../utils/firebase'
import history from '../logic/history'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import blue from '@material-ui/core/colors/blue'
import blueGrey from '@material-ui/core/colors/blueGrey'
import Paper from '@material-ui/core/Paper'
import Home from './Home'
import Competition from './Competition'
import Register from './Register'

// typography
const typography = {
	fontFamily: [
		'Playfair Display',
		'Open Sans',
		'"Helvetica Neue"',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"'
	].join(',')
}

const theme = {
	palette: {
		primary: blue,
		secondary: blueGrey,
		type: 'light'
	},
	typography: typography
}

export default function App() {
	const firebase = useContext(FirebaseContext)
	const muiTheme = createMuiTheme(theme)
	return (
		<>
			<ThemeProvider theme={muiTheme}>
				<CssBaseline />
				<Router history={history}>
					<Paper>
						<Grid
							container
							direction='row'
							alignItems='center'
							justify='space-evenly'
							style={{ cursor: 'pointer' }}
							onClick={() => history.push('/')}
						>
							<Grid item>
								<img
									width='150vw'
									height='150vh'
									alt='CubingUSA'
									src={
										process.env.PUBLIC_URL +
										'/cubingusa_logo.png'
									}
								/>
							</Grid>
							<Grid item>
								<Typography
									style={{ cursor: 'pointer' }}
									align='center'
									variant='h2'
								>
									Cubing at Home 2020!
								</Typography>
								<Typography
									align='center'
									gutterBottom
									variant='h6'
								>
									Online Cubing Competitions for Quarantiners
								</Typography>
							</Grid>
							<Grid item>
								<img
									width='150vw'
									height='150vh'
									alt='Cubicle'
									src={
										process.env.PUBLIC_URL +
										'/cubicle_logo.png'
									}
								/>
							</Grid>
						</Grid>
					</Paper>
					<Switch>
						<Route
							exact
							path='/cubing-at-home-I/register'
							component={Register}
						/>
						<Route
							exact
							path='/cubing-at-home-I'
							component={Competition}
						/>
						<Route exact path='/scrambles'>
							<Redirect to='/cubing-at-home-I/' />
						</Route>
						<Route exact path='/results'>
							<Redirect to='/cubing-at-home-I/' />
						</Route>
						<Route exact path='/' component={Home} />
						<Redirect to='/' />
					</Switch>
				</Router>
			</ThemeProvider>
		</>
	)
}
