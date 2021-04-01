import blue from '@material-ui/core/colors/blue'
import blueGrey from '@material-ui/core/colors/blueGrey'
import indigo from '@material-ui/core/colors/indigo'
import CssBaseline from '@material-ui/core/CssBaseline'
import LinearProgress from '@material-ui/core/LinearProgress'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import React, { useContext } from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import history from '../logic/history'
import { UserContext } from '../utils/auth'
import AdminHome from './Admin/AdminHome'
import CompetitionAdmin from './Admin/CompetitionAdmin'
import JudgeFinals from './Admin/JudgeFinals'
import NewCompetition from './Admin/NewCompetition'
import SetupBracket from './Admin/SetupBracket'
import AuthenticatedRoute from './AuthenticatedRoute'
import BackyardCubing from './BackyardCubing/BackyardCubing'
import CompetitionHome from './Competition/CompetitionHome'
import Register from './Competition/Register'
import Contact from "./Contact"
import FaqPage from "./FaqPage"
import Footer from './Footer/Footer'
import Header from './Header/Header'
import Home from './Home'

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
			primary: currentTheme === 'dark' ? blue : indigo,
			secondary: blueGrey,
			type: localStorage.getItem('cubingathome-theme') || 'light',
		},
		typography: typography,
	}
	const user = useContext(UserContext)
	const isAuthenticated = user
		? ['staff', 'organizer'].includes(user.data?.role)
		: false
	const muiTheme = createMuiTheme(theme)

	return (
		<>
			<ThemeProvider theme={muiTheme}>
				<CssBaseline />
				{user === null ? (
					<LinearProgress />
				) : (
						<div style={{ position: 'relative', minHeight: '100vh' }}>
							<Router history={history}>
								<Header history={history} />
								<Switch>
									<AuthenticatedRoute
										exact
										path='/admin'
										component={AdminHome}
										appProps={{ isAuthenticated }}
									/>
									<AuthenticatedRoute
										exact
										path='/admin/new'
										component={NewCompetition}
										appProps={{ isAuthenticated }}
									/>
									<AuthenticatedRoute
										exact
										path='/admin/bracket'
										component={SetupBracket}
										appProps={{ isAuthenticated }}
									/>
									<AuthenticatedRoute
										exact
										path='/admin/judge'
										component={JudgeFinals}
										appProps={{ isAuthenticated }}
									/>
									<AuthenticatedRoute
										exact
										path='/admin/:competitionId'
										component={CompetitionAdmin}
										appProps={{ isAuthenticated }}
									/>
									
									{/* <Route
									exact
									path='/cubing-at-home-I/register'
									component={Register2}
								/>
								<Route
									exact
									path='/cubing-at-home-I/:tab?'
									component={Competition}
								/> */}
									<Route exact path="/faq" component={FaqPage} />
									<Route exact path="/backyardcubing" component={BackyardCubing}/>
									<Route exact path="/contact" component={Contact} />
									<Route exact path='/:id/faq'>
										<Redirect to="/faq" />
									</Route>
									<Route exact path='/:id/register' component={Register} />
									<Route exact path='/:id/:tab?' component={CompetitionHome} />
									<Route exact path='/' component={Home} />
									<Route exact path='/:id' component={CompetitionHome} />
									<Route exact path='/s2'>
										<Redirect to='/' />
									</Route>
									<Route render={() => <Redirect to='/' />} />
								</Switch>
								<footer>
									<Footer
										currTheme={currentTheme}
										onThemeChange={() => {
											localStorage.setItem(
												'cubingathome-theme',
												currentTheme === 'light' ? 'dark' : 'light'
											)
											setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')
										}}
										isAuthenticated={isAuthenticated}
									/>
								</footer>
							</Router>
						</div>
					)}
			</ThemeProvider>
		</>
	)
}
