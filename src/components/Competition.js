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

import Info from './Info'
import Schedule from './Schedule'
import Competitors from './Competitors'

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

export default function Competition({ history }) {
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
			setCompetitors(competitors)
			// firebase
			// 	.firestore()
			// 	.collection('CubingAtHomeI')
			// 	.doc('Competitors')
			// 	.set({ competitors: competitors })
			setLoading(false)
		})
	}, [firebase])
	const classes = useStyles()
	const [value, setValue] = React.useState(0)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	return (
		<div className={classes.root}>
			{!competitors || loading ? (
				<LinearProgress />
			) : (
				<>
					<AppBar color='inherit' position='static'>
						<Tabs
							value={value}
							onChange={handleChange}
							aria-label='simple tabs example'
						>
							<Tab label='Information' {...a11yProps(0)} />
							<Tab label='Schedule' {...a11yProps(1)} />
							<Tab label='Competitors' {...a11yProps(2)} />
							<Tab label='Discord' {...a11yProps(3)} />
						</Tabs>
					</AppBar>
					<TabPanel value={value} index={0}>
						<Info history={history} />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<Schedule />
					</TabPanel>
					<TabPanel value={value} index={2}>
						<Competitors
							history={history}
							competitors={competitors}
						/>
					</TabPanel>
					<TabPanel value={value} index={3}>
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
