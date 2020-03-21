import React from 'react'
import Typorgraphy from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
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
import { Tooltip, LinearProgress } from '@material-ui/core'
import { getMe } from '../logic/wca-api'

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

export default function Home() {
	const classes = useStyles()
	const [user, setUser] = React.useState(null)
	React.useEffect(() => {
		if (isSignedIn()) {
			getMe().then(user => setUser(user.me))
		}
	}, [])
	console.log(user)
	return (
		<>
			{isSignedIn() && user === null ? (
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
					<Grid item className={classes.grid}>
						{isSignedIn() ? (
							<Button variant='contained' onClick={signOut}>
								{user.name}, Logout
							</Button>
						) : (
							<Button
								onClick={signIn}
								variant='contained'
								startIcon={<InfoIcon />}
							>
								Sign in With WCA
							</Button>
						)}
					</Grid>
					{/* 
					<Grid item className={classes.grid}>
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
									<ListItemSecondaryAction>
										<ButtonGroup
											size='small'
											variant='contained'
										>
											<Button
												variant='contained'
												color='primary'
												startIcon={<InfoIcon />}
											>
												Info
											</Button>
											<Button
												variant='contained'
												color='primary'
												startIcon={<AddCircleIcon />}
												disabled={!isSignedIn()}
											>
												Register
											</Button>
										</ButtonGroup>
									</ListItemSecondaryAction>
								</ListItem>
							</List>
						</Paper>
					</Grid>
				</Grid>
			)}
		</>
	)
}
