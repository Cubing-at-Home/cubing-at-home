import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { LinearProgress } from '@material-ui/core'
import { FirebaseContext } from '../utils/firebase'
import Faq from 'react-faq-component'
import Info from './Info'
import Schedule from './Schedule'
import Competitors from './Competitors'
import { faq } from '../logic/consts'
import blue from '@material-ui/core/colors/blue'
import blueGrey from '@material-ui/core/colors/blueGrey'
import Scrambles from './Scrambles'
import Results from './Results'
import { isSignedIn } from '../logic/auth'
import { getMe } from '../logic/wca-api'

function TabPanel(props) {
	const { children, value, index, ...other } = props

	return (
		<Typography
			component='div'
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</Typography>
	)
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`
	}
}

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper
	}
}))

const tabs = {
	information: 0,
	schedule: 1,
	competitors: 2,
	scrambles: 3,
	results: 4,
	faq: 5,
	discord: 6
}

export default function Competition({ history, match }) {
	const [competitors, setCompetitors] = React.useState(null)
	const [loading, setLoading] = React.useState(true)
	const firebase = React.useContext(FirebaseContext)
	React.useEffect(() => {
		async function getMarkers() {
			let markers = []
			await firebase
				.firestore()
				.collection('CubingAtHomeI')
				.doc('Competitors')
				.get()
				.then(querySnapshot => {
					markers = querySnapshot.data().competitors
				})
			return markers
		}
		setLoading(true)
		getMarkers().then(competitors => {
			if (isSignedIn()) {
				getMe().then(user => {
					const me = competitors.find(
						competitor => competitor.id === user.me.id
					)
					setCompetitors([
						me,
						...competitors.filter(
							competitor => competitor.id !== me.id
						)
					])
				})
			} else {
				setCompetitors(competitors)
			}
			setLoading(false)
		})
	}, [firebase])
	const classes = useStyles()

	const [value, setValue] = React.useState(match.params.tab || 'information')

	const handleChange = (event, newValue) => {
		history.push(
			`/cubing-at-home-I/${event.target.innerText.toLowerCase()}`
		)
		setValue(event.target.innerText.toLowerCase())
	}

	return (
		<div className={classes.root}>
			{!competitors || loading ? (
				<LinearProgress />
			) : (
				<>
					<AppBar color='inherit' position='static'>
						<Tabs
							value={tabs[value]}
							onChange={handleChange}
							aria-label='simple tabs example'
						>
							<Tab label='Information' {...a11yProps(0)} />
							<Tab label='Schedule' {...a11yProps(1)} />
							<Tab label='Competitors' {...a11yProps(2)} />
							<Tab label='Scrambles' {...a11yProps(3)} />
							<Tab label='Results' {...a11yProps(4)} />
							<Tab label='FAQ' {...a11yProps(5)} />
							<Tab label='Discord' {...a11yProps(6)} />
						</Tabs>
					</AppBar>
					<TabPanel value={tabs[value]} index={0}>
						<Info history={history} />
					</TabPanel>
					<TabPanel value={tabs[value]} index={1}>
						<Schedule />
					</TabPanel>
					<TabPanel value={tabs[value]} index={2}>
						<Competitors
							history={history}
							competitors={competitors}
						/>
					</TabPanel>
					<TabPanel value={tabs[value]} index={3}>
						<Scrambles />
					</TabPanel>
					<TabPanel value={tabs[value]} index={4}>
						<Results />
					</TabPanel>
					<TabPanel value={tabs[value]} index={5}>
						<Faq
							data={faq}
							styles={{
								titleTextColor: blue[500],
								rowTitleColor: blue[500],
								rowTextColor: blueGrey[500]
							}}
						/>
					</TabPanel>
					<TabPanel value={tabs[value]} index={6}>
						<iframe
							title='discord'
							src='https://discordapp.com/widget?id=690084292323311720&theme=dark'
							width='1000vw'
							height='500vh'
							allowtransparency='true'
							frameborder='0'
						></iframe>
					</TabPanel>
				</>
			)}
		</div>
	)
}
