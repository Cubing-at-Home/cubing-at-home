import React, { useContext, useState, useEffect } from 'react'
import {
	BrowserRouter as Router,
	Switch,
	Redirect,
	Route
} from 'react-router-dom'
import 'firebase/firestore'
import { FirebaseContext } from '../utils/firebase'
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
				<Paper>
					<Grid
						container
						direction='row'
						alignItems='center'
						justify='space-evenly'
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
							<Typography align='center' variant='h2'>
								Cubing At Home 2020!
							</Typography>
							<Typography
								align='center'
								gutterBottom
								variant='h6'
							>
								An Online Cubing Competition for Quarantiners
							</Typography>
						</Grid>
						<Grid item>
							<img
								width='150vw'
								height='150vh'
								alt='Cubicle'
								src={
									process.env.PUBLIC_URL + '/cubicle_logo.png'
								}
							/>
						</Grid>
					</Grid>
				</Paper>
				<Router>
					<Route exact path='/' component={Home} />
					<Route
						exact
						path='/cubing-at-home-I'
						component={Competition}
					/>
					<Route
						exact
						path='/cubing-at-home-I/register'
						component={Register}
					/>
				</Router>
			</ThemeProvider>
		</>
	)
}
