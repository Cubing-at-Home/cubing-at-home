import { LinearProgress, Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import NotRegisteredIcon from '@material-ui/icons/Cancel'
import RegisteredIcon from '@material-ui/icons/CheckCircleOutline'
import { makeStyles } from '@material-ui/styles'
import moment from 'moment-timezone'
import React from 'react'
import { Link } from 'react-router-dom'
import ReactTwitchEmbedVideo from 'react-twitch-embed-video'
import { UserContext } from '../utils/auth'
import { FirebaseContext } from '../utils/firebase'
import LandingCarousel from './LandingCarousel'

const useStyles = makeStyles((theme) => ({
	grid: {
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4),
	},
	paper: {
		width: '80vw',
	},
	list: {
		textAlign: 'center',
	},
}))

export default function Home({ history }) {
	const classes = useStyles()
	const user = React.useContext(UserContext)
	const firebase = React.useContext(FirebaseContext)
	const [competitions, setCompetiions] = React.useState(null)
	const [happeningNow, setHappeningNow] = React.useState(null)
	React.useEffect(() => {
		const db = firebase.firestore()
		db.collection('competitions')
			.orderBy('start', 'desc')
			.get()
			.then((querySnapshot) => {
				let competitions = []
				querySnapshot.forEach((doc) => competitions.push(doc.data()))
				setCompetiions(competitions)
				if (
					competitions.length >= 1 &&
					moment().isSame(moment(competitions[0].start), 'day')
				) {
					setHappeningNow(competitions[0])
				}
			})
		// db.collection('cah2practice')
		// 	.doc('info')
		// 	.get()
		// 	.then((resp) => {
		// 		const competitors = resp.data().competitors
		// 		for (const competitor of competitors) {
		// 			db.collection('cah2practice')
		// 				.doc(competitor)
		// 				.update({ id: competitor })
		// 		}
		// 	})
		// This is to set a schedule for a competition. Still need to add UI for this.
		// db.collection('cah5')
		// 	.doc('info')
		// 	.get()
		// 	.then((doc) => {
		// 		const data = doc.data()
		// 		db.collection('cah5')
		// 			.doc('info')
		// 			.set({ ...data, schedule: rounds })
		// 	})
	}, [firebase])
	return (
		<>
			{user === null || !competitions ? (
				<LinearProgress />
			) : (
				<Grid
					className={classes.grid}
					container
					direction='column'
					alignContent='center'
					alignItems='center'
					justify='center'
				>
					{' '}
					{happeningNow !== null ? (
						<Grid item className={classes.grid}>
							<Typography
								align='center'
								variant='h6'
							>{`Ongoing: ${happeningNow.name}`}</Typography>
							<ReactTwitchEmbedVideo channel='cubingusa' />
						</Grid>
					) : (
						<Grid item className={classes.grid}>
							<LandingCarousel />
						</Grid>
					)}
					{user !== undefined && (
						<Grid item>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justify: 'space-between',
								}}
							>
								{user.data.seasons && user.data.seasons.includes('s2') ? (
									<RegisteredIcon color='primary' />
								) : (
									<NotRegisteredIcon color='error' />
								)}
								<Typography variant='h5'>
									{`Hi ${user.wca.name.split(' ')[0]}, you are ${
										user.data.seasons?.includes('s2') ? 'successfully' : 'not'
									} registered for C@H Season 2`}
								</Typography>
							</div>
						</Grid>
					)}
					<Grid item className={classes.grid}>
						<Paper className={classes.paper}>
							<List
								className={classes.list}
								style={{ overflow: 'auto' }}
								subheader={
									<ListSubheader disableSticky={true}>Season 2</ListSubheader>
								}
							>
								{competitions.filter((competition) =>
									moment().isSameOrBefore(moment(competition.end), 'day')
								).length === 0 && (
									<ListItem>
										<ListItemText>
											No Competitions are currently available. Stay tuned.
										</ListItemText>
									</ListItem>
								)}
								{competitions
									.filter((competition) =>
										moment().isSameOrBefore(moment(competition.end), 'day')
									)
									.map((competition) => (
										<ListItem
											key={competition.id}
											alignItems='center'
											button
											component={Link}
											to={`/${competition.id}`}
										>
											<ListItemText
												primary={competition.name}
												secondary={moment(competition.start).format(
													'MMMM Do YYYY'
												)}
											/>
											<ListItemSecondaryAction>
												<Button
													size='small'
													color='primary'
													variant='contained'
													startIcon={<AddCircleIcon />}
													href={`/s2/register`}
												>
													{user !== undefined &&
													user.data.competitions.includes(competition.id)
														? 'Manage Registration'
														: 'Register'}
												</Button>
											</ListItemSecondaryAction>
										</ListItem>
									))}
							</List>
						</Paper>
					</Grid>
					<Grid item className={classes.grid}>
						<Paper className={classes.paper}>
							<List
								className={classes.list}
								style={{ overflow: 'auto' }}
								subheader={
									<ListSubheader disableSticky={true}>
										Past Events
									</ListSubheader>
								}
							>
								{competitions
									.filter((competition) =>
										moment().isAfter(moment(competition.end), 'day')
									)
									.map((competition) => (
										<ListItem
											key={competition.id}
											alignItems='center'
											button
											component={Link}
											to={`/${competition.id}`}
										>
											<ListItemText
												primary={competition.name}
												secondary={moment(competition.start).format(
													'MMMM Do YYYY'
												)}
											/>
										</ListItem>
									))}
								<ListItem
									alignItems='center'
									// button
									// component={Link}
									// to={`/cubing-at-home-I`}
								>
									<ListItemText
										primary={'Cubing at Home I'}
										secondary={'March 28th, 2020'}
									/>
								</ListItem>
							</List>
						</Paper>
					</Grid>
				</Grid>
			)}
		</>
	)
}
