import React, { useContext, useState, useEffect } from 'react'
import { FirebaseContext } from '../../utils/firebase'
import { UserContext } from '../../utils/auth'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Link } from 'react-router-dom'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'

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

export default function AdminHome({ history }) {
	const firebase = useContext(FirebaseContext)
	const [managableCompetitions, setManagableCompetitions] = useState([])
	const classes = useStyles()
	useEffect(() => {
		const competitions = []
		firebase
			.firestore()
			.collection('Competitions')
			.get()
			.then((query) => {
				query.forEach((q) => competitions.push(q.data()))
				setManagableCompetitions(competitions)
			})
	}, [])
	const user = useContext(UserContext)
	return (
		<Grid
			className={classes.grid}
			container
			direction='column'
			justify='center'
			alignItems='center'
			alignContent='center'
		>
			<Grid item>
				<Paper className={classes.paper}>
					<List
						className={classes.list}
						subheader={
							<ListSubheader disableSticky={true}>
								Managable Competitions
							</ListSubheader>
						}
					>
						{managableCompetitions.map((competition) => (
							<ListItem
								key={competition.id}
								alignItems='center'
								button
								component={Link}
								to={`/admin/${competition.id}`}
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
			<Grid item>
				<Button
					variant='contained'
					color='primary'
					onClick={() => history.push('/admin/new')}
				>
					New Competition
				</Button>
			</Grid>
		</Grid>
	)
}
