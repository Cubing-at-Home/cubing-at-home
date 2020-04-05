import React from 'react'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import InfoIcon from '@material-ui/icons/Info'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import ReactTwitchEmbedVideo from 'react-twitch-embed-video'
import { signIn, isSignedIn, signOut } from '../logic/auth'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/styles'
import { LinearProgress } from '@material-ui/core'
import { UserContext } from '../utils/auth'
import { FirebaseContext } from '../utils/firebase'

const useStyles = makeStyles(theme => ({
	grid: {
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4)
	},
	paper: {
		width: '80vw'
	},
	list: {
		textAlign: 'center'
	}
}))

export default function Home({ history }) {
	const classes = useStyles()
	const user = React.useContext(UserContext)
	const firebase = React.useContext(FirebaseContext)
	const [competitions, setCompetiions] = React.useState(null)
	React.useEffect(() => {
		const db = firebase.firestore()
		db.collection('Competitions')
			.where('start', '>=', new Date())
			.orderBy('start')
			.limit(5)
			.get()
			.then(querySnapshot => {
				let competitions = []
				querySnapshot.forEach(doc => competitions.push(doc.data()))
				setCompetiions(competitions)
			})
	}, [firebase])
	return (
		<>
			{(isSignedIn() && user === null) || !competitions ? (
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
					{/* <Grid item className={classes.grid}>
						<ReactTwitchEmbedVideo channel='cubingusa' />
					</Grid> */}
					<Grid item className={classes.grid}>
						<Paper className={classes.paper}>
							<List
								className={classes.list}
								style={{ overflow: 'auto' }}
								subheader={
									<ListSubheader disableSticky={true}>
										Upcoming Events
									</ListSubheader>
								}
							>
								{competitions.map(competition => (
									<ListItem
										key={competition.id}
										alignItems='center'
										button
										component={Link}
										to={`/${competition.id}`}
									>
										<ListItemText
											primary={competition.name}
											secondary={competition.start
												.toDate()
												.toDateString()}
										/>
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
								<ListItem
									alignItems='center'
									button
									component={Link}
									to={`/cubing-at-home-I`}
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
