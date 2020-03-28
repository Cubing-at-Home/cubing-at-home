import React from 'react'
import { isSignedIn, signIn } from '../logic/auth'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/styles'
import { getMe } from '../logic/wca-api'
import { TextField } from '@material-ui/core'
import { WCA_ORIGIN } from '../logic/wca-env'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'
import { FirebaseContext } from '../utils/firebase'

const useStyles = makeStyles(theme => ({
	grid: {
		marginTop: theme.spacing(2)
	},
	avatar: {
		width: theme.spacing(10),
		height: theme.spacing(10)
	}
}))

export default function Register({ history }) {
	const [user, setUser] = React.useState(null)
	const [checked, setChecked] = React.useState(false)
	const [loading, setLoading] = React.useState(true)
	const [error, setError] = React.useState(null)
	const [registered, setRegistered] = React.useState(false)
	const firebase = React.useContext(FirebaseContext)
	React.useEffect(() => {
		const firestore = firebase.firestore()
		if (user) {
		}
		user &&
			firestore
				.collection('CubingAtHomeI')
				.doc('Competitors2')
				.get()
				.then(doc => {
					if (
						doc
							.data()
							.competitors.filter(
								competitor => competitor.id === user.id
							).length > 0
					) {
						setRegistered(true)
						setLoading(false)
					} else {
						firestore
							.collection('CubingAtHomeI')
							.doc('Competitors')
							.get()
							.then(doc => {
								if (
									doc
										.data()
										.competitors.filter(
											competitor =>
												competitor.id === user.id
										).length > 0
								) {
									setRegistered(true)
								}
								setLoading(false)
							})
					}
				})
	}, [user, firebase, loading])
	const handleChange = event => {
		setChecked(event.target.checked)
	}
	React.useEffect(() => {
		if (!isSignedIn()) {
			history.push('/')
		} else {
			getMe().then(user => setUser(user.me))
		}
	}, [])
	const classes = useStyles()

	const handleSubmit = bool => {
		const data = {
			name: user.name,
			avatar: user.avatar.url,
			email: user.email,
			wcaId: user.wca_id,
			id: user.id,
			url: user.url
		}
		const firestore = firebase.firestore()
		if (bool) {
			firestore
				.collection('CubingAtHomeI')
				.doc('Competitors2')
				.update({
					competitors: firebase.firestore.FieldValue.arrayUnion(data)
				})
				.then(() => {
					setLoading(false)
					setRegistered(true)
				})
				.catch(err => {
					console.log(err)
				})
		} else {
			let document = ''
			firestore
				.collection('CubingAtHomeI')
				.doc('Competitors')
				.get()
				.then(doc => {
					const competitors = doc.data().competitors
					const me = competitors.filter(
						competitor => competitor.id === user.id
					)
					if (me.length > 1) {
						document = 'Competitors'
					} else {
						document = 'Competitors2'
					}
					firestore
						.collection('CubingAtHomeI')
						.doc(document)
						.update({
							competitors: firebase.firestore.FieldValue.arrayRemove(
								data
							)
						})
						.then(() => {
							setRegistered(false)
							setLoading(false)
						})
						.catch(err => {
							console.log(err)
						})
				})
		}
	}

	return (
		<>
			{!user || loading ? (
				<LinearProgress />
			) : error ? (
				<Typography variant='h1' color='error'>
					{error}
				</Typography>
			) : (
				<Grid
					container
					alignItems='center'
					justify='center'
					alignContent='center'
					className={classes.grid}
					spacing={1}
					direction='column'
				>
					{/*
					<Grid item>
						<Typography variant='h6'>
							Cubing At Home Registration
						</Typography>
					</Grid>
					 <Grid item>
						<Avatar
							alt={user.name}
							src={user.avatar.url}
							className={classes.avatar}
						/>
					</Grid>
					<Grid item>
						<TextField label='Name' value={user.name} disabled />
						<TextField
							fullWidth
							label='Email'
							value={user.email}
							disabled
							helperText={
								<>
									{`You can change this information in your WCA
									Account `}
									<Link href={`${WCA_ORIGIN}/profile/edit`}>
										here
									</Link>
								</>
							}
						/>
					</Grid> */}
					{registered ? (
						<>
							<Grid item>
								<Typography variant='h4'>
									You have successfully registered for this
									competition
								</Typography>
							</Grid>
							{/* <Grid item>
								<Button
									onClick={() => handleSubmit(false)}
									variant='contained'
									color='primary'
								>
									Cancel Registration
								</Button>
							</Grid> */}
						</>
					) : (
						<>
							<Grid item>
								<Typography align='center' variant='h4'>
									Registration is closed. Follow{' '}
									<Link href='https://instagram.com/cubingusa'>
										CubingUSA
									</Link>
									for notifications about upcoming Cubing At
									Home Competitions!
								</Typography>
							</Grid>
							{/* <Grid item>
								<FormControlLabel
									style={{ maxWidth: '50vw' }}
									control={
										<Checkbox
											checked={checked}
											onChange={handleChange}
											color='primary'
										/>
									}
									label={
										<ul>
											<li>
												By signing up, I agree to submit
												my times as they occur along
												with any penalties. I understand
												that any form of cheating can
												result in disqualification for
												any further Cubing at Home
												competitions.
											</li>
											<li>
												I also understand that in order
												to claim a podium prize, I am
												required to submit a full uncut
												video of the entire round.
											</li>
											<li>
												I allow CubingUSA and/or The
												Cubicle to edit and repost any
												videos I submit and content I
												particiapte in for this event
												without any additional
												compensation
											</li>
										</ul>
									}
								/>
							</Grid>
							<Grid item>
								<Button
									color='primary'
									disabled={!checked}
									variant='contained'
									onClick={() => handleSubmit(true)}
								>
									Register
								</Button>
							</Grid> */}
						</>
					)}
				</Grid>
			)}
		</>
	)
}
