import React, { useContext, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import LinearProgress from '@material-ui/core/LinearProgress'
import { makeStyles } from '@material-ui/styles'
import { TextField } from '@material-ui/core'
import { WCA_ORIGIN } from '../../logic/wca-env'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'
import { FirebaseContext } from '../../utils/firebase'
import { UserContext } from '../../utils/auth'
import { signIn } from '../../logic/auth'
import { registerCompetitor, cancelCompetitor } from '../../database/writes'

const useStyles = makeStyles((theme) => ({
	grid: {
		marginTop: theme.spacing(2),
	},
	avatar: {
		width: theme.spacing(10),
		height: theme.spacing(10),
	},
}))

export default function Register({ history, match }) {
	const user = useContext(UserContext)
	const [checked, setChecked] = useState(false)
	const [error, setError] = useState(false)
	const competitionId = match.params.id
	const registered = user
		? user.data.competitions.includes(competitionId)
		: false
	const firebase = React.useContext(FirebaseContext)
	const [competitionInfo, setCompetitionInfo] = useState(null)
	React.useEffect(() => {
		if (user === undefined) {
			signIn()
		}
		firebase
			.firestore()
			.collection(competitionId)
			.doc('info')
			.get()
			.then((resp) => {
				setCompetitionInfo(resp.data())
			})
			.catch((err) => setError(err))
	}, [competitionId, firebase, user])
	const handleChange = (event) => {
		setChecked(event.target.checked)
	}
	const handleSubmit = (register) => {
		const exec = register ? registerCompetitor : cancelCompetitor
		exec(firebase, user.wca.id.toString(), competitionId)
			.then(() => window.location.reload())
			.catch((err) => setError(err))
	}
	const classes = useStyles()
	return (
		<>
			{!user || !competitionInfo ? (
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
					<Grid item>
						<Typography variant='h6'>
							{competitionInfo.name}
						</Typography>
					</Grid>
					<Grid item>
						<Avatar
							alt={user.wca.name}
							src={user.wca.avatar.url}
							className={classes.avatar}
						/>
					</Grid>
					<Grid item>
						<TextField
							label='Name'
							value={user.wca.name}
							disabled
						/>
						<TextField
							fullWidth
							label='Email'
							value={user.wca.email}
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
					</Grid>
					{registered ? (
						<>
							<Grid item>
								<Typography variant='h4'>
									You have successfully registered for this
									competition
								</Typography>
							</Grid>
							<Grid item>
								<Button
									onClick={() => handleSubmit(false)}
									variant='contained'
									color='primary'
								>
									Cancel Registration
								</Button>
							</Grid>
						</>
					) : new Date() >
					  competitionInfo.registrationEnd.toDate() ? (
						<Grid item>
							<Typography align='center' variant='h4'>
								{`Registration is closed. Follow `}
								<Link href='https://instagram.com/cubingusa'>
									{` CubingUSA `}
								</Link>
								{`for notifications about upcoming Cubing At Home
								Competitions!`}
							</Typography>
						</Grid>
					) : new Date() <
					  competitionInfo.registrationStart.toDate() ? (
						<Grid item>
							<Typography align='center' variant='h4'>
								{`Registration opens on: ${competitionInfo.registrationStart
									.toDate()
									.toDateString()} `}
							</Typography>
						</Grid>
					) : (
						<>
							<Grid item>
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
							</Grid>
						</>
					)}
				</Grid>
			)}
		</>
	)
}
