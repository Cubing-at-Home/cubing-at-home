import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { LinearProgress } from '@material-ui/core'
import { FirebaseContext } from '../../utils/firebase'
import Faq from 'react-faq-component'
import Info from './Info'
import Schedule from './Schedule'
import Competitors from './Competitors'
import { faq } from '../../logic/consts'
import blue from '@material-ui/core/colors/blue'
import blueGrey from '@material-ui/core/colors/blueGrey'
import Scrambles from './Scrambles'
import Results from './Results'
import { UserContext } from '../../utils/auth'

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
	value: PropTypes.any.isRequired,
}

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
	scrambles: 3,
	results: 4,
	faq: 5,
	discord: 6,
}

export default function CompetitionHome({ history, match }) {
	const [competitionInfo, setCompetitionInfo] = React.useState(null)
	const firebase = React.useContext(FirebaseContext)
	React.useEffect(() => {
		firebase
			.firestore()
			.collection(match.params.id)
			.doc('info')
			.get()
			.then((resp) => setCompetitionInfo(resp.data()))
	}, [firebase])
	const classes = useStyles()

	const [value, setValue] = React.useState(match.params.tab || 'information')

	const handleChange = (event, newValue) => {
		history.push(
			`/${match.params.id}/${event.target.innerText.toLowerCase()}`
		)
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
							<Tab label='Scrambles' {...a11yProps(3)} />
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
						<Competitors
							competitionInfo={competitionInfo}
							history={history}
						/>
					</TabPanel>
					<TabPanel value={tabs[value]} index={3}>
						<Scrambles competitionInfo={competitionInfo} />
					</TabPanel>
					<TabPanel value={tabs[value]} index={4}>
						<Results />
					</TabPanel>
					<TabPanel value={tabs[value]} index={5}>
						<div>
							<Faq
								data={faq}
								styles={{
									titleTextColor: blue[500],
									rowTitleColor: blue[500],
									rowTextColor: blueGrey[500],
								}}
							/>
							<Typography
								color='primary'
								align='center'
								variant='h6'
							>
								<Link
									color='inherit'
									target='_blank'
									rel='noopener noreferrer'
									href='mailto:sgrover@worldcubeassociation.org,cnielson@worldcubeassociation.org,bsampson@worldcubeassociation.org,sbaird@worldcubeassociation.org'
								>
									Contact Us
								</Link>
							</Typography>
						</div>
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
