import { LinearProgress } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import React from 'react'
import { FirebaseContext } from '../../utils/firebase'
import TabPanel from '../TabPanel'
import Compete from './Compete/Compete'
import Competitors from './Competitors'
import Info from './Info'
import Schedule from './Schedule'

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
}))

const tabs = {
	information: 0,
	schedule: 1,
	competitors: 2,
	compete: 3,
	results: 4,
	faq: 5,
	discord: 6,
}

export default function CompetitionHome({ history, match }) {
	const theme = useTheme()
	const [competitionInfo, setCompetitionInfo] = React.useState(null)
	const firebase = React.useContext(FirebaseContext)
	React.useEffect(() => {
		firebase
			.firestore()
			.collection('competitions')
			.doc(match.params.id)
			.get()
			.then((resp) =>
				resp.exists ? setCompetitionInfo(resp.data()) : history.push('/')
			)
			.catch((err) => history.push('/'))
	}, [firebase, history, match.params.id])
	const classes = useStyles()

	const [value, setValue] = React.useState(match.params.tab || 'information')

	const handleChange = (event, newValue) => {
		history.push(`/${match.params.id}/${event.target.innerText.toLowerCase()}`)
		setValue(event.target.innerText.toLowerCase())
	}

	return (
		<div className={classes.root}>
			{!competitionInfo ? (
				<LinearProgress />
			) : (
					<>
						<AppBar color='inherit' position='static'>
							<Tabs
								scrollButtons='on'
								variant='scrollable'
								value={tabs[value]}
								onChange={handleChange}
								aria-label='simple tabs example'
							>
								<Tab label='Information' {...a11yProps(0)} />
								<Tab label='Schedule' {...a11yProps(1)} />
								<Tab label='Competitors' {...a11yProps(2)} />
								<Tab label='Compete' {...a11yProps(3)} />
								<Tab label='Results' {...a11yProps(4)} />
								<Tab label='FAQ' {...a11yProps(5)} />
								<Tab label='Discord' {...a11yProps(6)} />
							</Tabs>
						</AppBar>
						<TabPanel value={tabs[value]} index={0}>
							<Info
								history={history}
								match={match}
								competitionInfo={competitionInfo}
							/>
						</TabPanel>
						<TabPanel value={tabs[value]} index={1}>
							<Schedule competitionInfo={competitionInfo} />
						</TabPanel>
						<TabPanel value={tabs[value]} index={2}>
							<Competitors competitionInfo={competitionInfo} history={history} />
						</TabPanel>
						<TabPanel value={tabs[value]} index={3}>
							<Compete competitionInfo={competitionInfo} />
						</TabPanel>
						<TabPanel value={tabs[value]} index={4}>
							{() =>
								window.location.replace(
									`https://results.cubingathome.com/${match.params.id}`
								)
							}
						</TabPanel>
						<TabPanel value={tabs[value]} index={5}>
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
