import React, { useContext } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { FirebaseContext } from '../utils/firebase'
import history from '../logic/history'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import LinearProgress from '@material-ui/core/LinearProgress'
import indigo from '@material-ui/core/colors/indigo'
import blueGrey from '@material-ui/core/colors/blueGrey'
import Home from './Home'
import Competition from './Competition'
import Register from './Register'
import NewCompetition from './Admin/NewCompetition'
import Header from './Header/Header'
import { featured } from '../logic/consts'
import AdminHome from './Admin/AdminHome'
import { UserContext } from '../utils/auth'
import { isAdmin } from '../logic/auth'
import CompetitionHome from './Competition/CompetitionHome'
import Footer from './Footer/Footer'

// typography
const typography = {
	fontFamily: [
		'Playfair Display',
		'Open Sans',
		'"Helvetica Neue"',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
}

export default function App() {
	const [currentTheme, setCurrentTheme] = React.useState(
		localStorage.getItem('cubingathome-theme') || 'light'
	)
	const theme = {
		palette: {
			primary: indigo,
			secondary: blueGrey,
			type: localStorage.getItem('cubingathome-theme') || 'light',
		},
		typography: typography,
	}
	const firebase = useContext(FirebaseContext)
	const user = useContext(UserContext)
	const muiTheme = createMuiTheme(theme)
	const [routes, setRoutes] = React.useState(null)

	React.useEffect(() => {
		const routes = featured.map(({ link, social }) => (
			<Route
				key={link}
				path={`/${link}`}
				render={() => window.location.assign(social)}
			/>
		))
		setRoutes(routes)
	}, [])
	async function getPsychUrl(document) {
		let url = ''
		await firebase
			.firestore()
			.collection('CubingAtHomeI')
			.doc(document)
			.get()
			.then((doc) => {
				let competitors = doc.data().competitors
				for (const competitor of competitors) {
					if (competitor.wcaId !== null) {
						url += `${competitor.wcaId},`
					}
				}
			})
		return url
	}
	return (
		<>
			<ThemeProvider theme={muiTheme}>
				<CssBaseline />
				{!routes || user === null ? (
					<LinearProgress />
				) : (
					<Router history={history}>
						<Header history={history} />
						<Switch>
							<Route
								exact
								path='/cubing-at-home-I/register'
								component={Register}
							/>
							<Route
								exact
								path='/cubing-at-home-I/:tab?'
								component={Competition}
							/>
							<Route
								exact
								path='/:id/:tab?'
								component={CompetitionHome}
							/>
							<Route exact path='/' component={Home} />
							<Route
								exact
								path='/psych'
								render={() => {
									getPsychUrl('Competitors').then(
										getPsychUrl('Competitors2').then(
											(url) =>
												(window.location.href = `https://jonatanklosko.github.io/rankings/#/rankings/show?name=Cubing+at+Home+I+Psych+Sheet&wcaids=${url}`)
										)
									)
								}}
							/>
							{user && isAdmin(user.wca) && (
								<>
									<Route
										exact
										path='/admin'
										component={AdminHome}
									/>
									<Route
										exact
										path='/admin/new'
										component={NewCompetition}
									/>
								</>
							)}
							<Route
								exact
								path='/:id'
								component={CompetitionHome}
							/>
							<Route render={() => <Redirect to='/' />} />
						</Switch>

						<Footer
							currTheme={currentTheme}
							onThemeChange={() => {
								console.log(currentTheme)
								localStorage.setItem(
									'cubingathome-theme',
									currentTheme === 'light' ? 'dark' : 'light'
								)
								setCurrentTheme(
									currentTheme === 'light' ? 'dark' : 'light'
								)
							}}
						/>
					</Router>
				)}
			</ThemeProvider>
		</>
	)
}
